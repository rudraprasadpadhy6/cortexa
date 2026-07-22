const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Helper to generate a 24-character hex ID (similar to MongoDB ObjectId)
function generateId() {
    return crypto.randomBytes(12).toString('hex');
}

// Global in-memory cache
const memDb = {};

// Local data directory
const DATA_DIR = path.join(__dirname, '../data');

// Load data for a specific model from JSON file or cache
function loadData(modelName) {
    if (memDb[modelName]) {
        return memDb[modelName];
    }
    const filePath = path.join(DATA_DIR, `${modelName.toLowerCase()}.json`);
    try {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            memDb[modelName] = JSON.parse(fileContent);
            return memDb[modelName];
        }
    } catch (err) {
        console.warn(`[db.js] Warning loading file for ${modelName}:`, err.message);
    }
    memDb[modelName] = [];
    return memDb[modelName];
}

// Save data for a specific model to JSON file
function saveData(modelName) {
    const filePath = path.join(DATA_DIR, `${modelName.toLowerCase()}.json`);
    try {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        fs.writeFileSync(filePath, JSON.stringify(memDb[modelName] || [], null, 2), 'utf8');
    } catch (err) {
        console.warn(`[db.js] Warning saving file for ${modelName} (falling back to memory):`, err.message);
    }
}

class Query {
    constructor(dataPromise) {
        this.promise = Promise.resolve(dataPromise);
    }

    sort(sortObj) {
        this.promise = this.promise.then(data => {
            if (!data) return data;
            const sortItems = (items) => {
                if (!Array.isArray(items)) return items;
                const key = Object.keys(sortObj)[0];
                const direction = sortObj[key]; // 1 or -1
                return [...items].sort((a, b) => {
                    let valA = a[key];
                    let valB = b[key];
                    
                    // Handle dates or cases where fields might be undefined/null
                    if (valA instanceof Date) valA = valA.getTime();
                    if (valB instanceof Date) valB = valB.getTime();
                    if (typeof valA === 'string' && !isNaN(Date.parse(valA))) valA = new Date(valA).getTime();
                    if (typeof valB === 'string' && !isNaN(Date.parse(valB))) valB = new Date(valB).getTime();

                    if (valA === valB) return 0;
                    if (valA === undefined || valA === null) return 1;
                    if (valB === undefined || valB === null) return -1;

                    if (direction === -1 || direction === 'desc') {
                        return valA > valB ? -1 : 1;
                    }
                    return valA < valB ? -1 : 1;
                });
            };
            return sortItems(data);
        });
        return this;
    }

    select(fieldsStr) {
        this.promise = this.promise.then(data => {
            if (!data) return data;
            const fields = fieldsStr.split(/\s+/).filter(Boolean);

            const applySelect = (item) => {
                if (!item) return item;
                // Create clone preserving the prototype/methods
                const clone = Object.create(Object.getPrototypeOf(item));
                Object.assign(clone, item);

                for (const field of fields) {
                    if (field.startsWith('-')) {
                        delete clone[field.slice(1)];
                    } else {
                        // Inclusive fields support if needed, but not used in this app
                    }
                }
                return clone;
            };

            if (Array.isArray(data)) {
                return data.map(applySelect);
            }
            return applySelect(data);
        });
        return this;
    }

    then(onResolve, onReject) {
        return this.promise.then(onResolve, onReject);
    }

    catch(onReject) {
        return this.promise.catch(onReject);
    }
}

class BaseModel {
    constructor(data = {}) {
        const defaults = this.constructor.defaults || {};
        // Merge defaults and provided data
        Object.assign(this, defaults, data);

        // Ensure Mongo-like _id exists
        if (!this._id) {
            this._id = generateId();
        }
        if (!this.createdAt) {
            this.createdAt = new Date().toISOString();
        }
        if (!this.updatedAt) {
            this.updatedAt = new Date().toISOString();
        }
    }

    async save() {
        const modelName = this.constructor.modelName;
        const list = loadData(modelName);

        this.updatedAt = new Date().toISOString();

        // Convert class instance to a plain object for storage (JSON serialization/deserialization style)
        const plainObject = JSON.parse(JSON.stringify(this));

        const index = list.findIndex(item => item._id === this._id);
        if (index > -1) {
            list[index] = plainObject;
        } else {
            list.push(plainObject);
        }

        saveData(modelName);
        return this;
    }

    static find(query = {}) {
        const list = loadData(this.modelName);
        const filtered = list.filter(item => {
            for (const key in query) {
                const qVal = query[key] !== undefined && query[key] !== null ? query[key].toString() : query[key];
                const itemVal = item[key] !== undefined && item[key] !== null ? item[key].toString() : item[key];
                if (itemVal !== qVal) {
                    return false;
                }
            }
            return true;
        });

        const instances = filtered.map(item => new this(item));
        return new Query(instances);
    }

    static findOne(query = {}) {
        const list = loadData(this.modelName);
        const item = list.find(item => {
            for (const key in query) {
                const qVal = query[key] !== undefined && query[key] !== null ? query[key].toString() : query[key];
                const itemVal = item[key] !== undefined && item[key] !== null ? item[key].toString() : item[key];
                if (itemVal !== qVal) {
                    return false;
                }
            }
            return true;
        });

        const instance = item ? new this(item) : null;
        return new Query(instance);
    }

    static findById(id) {
        if (!id) return new Query(null);
        const list = loadData(this.modelName);
        const item = list.find(item => item._id.toString() === id.toString());
        const instance = item ? new this(item) : null;
        return new Query(instance);
    }

    static async countDocuments(query = {}) {
        const list = loadData(this.modelName);
        const filtered = list.filter(item => {
            for (const key in query) {
                const qVal = query[key] !== undefined && query[key] !== null ? query[key].toString() : query[key];
                const itemVal = item[key] !== undefined && item[key] !== null ? item[key].toString() : item[key];
                if (itemVal !== qVal) {
                    return false;
                }
            }
            return true;
        });
        return filtered.length;
    }
}

module.exports = { BaseModel, Query };
