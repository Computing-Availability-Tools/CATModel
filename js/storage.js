const Storage = (() => {
    const KEY_PREFIX = 'catmodel_records_';

    function generateId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    function getRecords(toolId) {
        const key = KEY_PREFIX + toolId;
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    function saveRecord(toolId, name, inputs, outputs) {
        const records = getRecords(toolId);
        const now = new Date().toISOString();
        const record = {
            id: generateId(),
            toolId: toolId,
            name: name || '未命名计算',
            createdAt: now,
            updatedAt: now,
            inputs: inputs,
            outputs: outputs
        };
        records.unshift(record);
        const key = KEY_PREFIX + toolId;
        localStorage.setItem(key, JSON.stringify(records));
        return record;
    }

    function deleteRecord(toolId, recordId) {
        let records = getRecords(toolId);
        records = records.filter(r => r.id !== recordId);
        const key = KEY_PREFIX + toolId;
        localStorage.setItem(key, JSON.stringify(records));
    }

    function clearRecords(toolId) {
        const key = KEY_PREFIX + toolId;
        localStorage.removeItem(key);
    }

    function exportRecords(toolId) {
        const records = getRecords(toolId);
        const data = {
            version: '1.0',
            toolId: toolId,
            exportedAt: new Date().toISOString(),
            records: records
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `catmodel_${toolId}_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function importRecords(toolId, file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (!data.records || !Array.isArray(data.records)) {
                        reject(new Error('无效的文件格式'));
                        return;
                    }
                    const existing = getRecords(toolId);
                    const merged = [...data.records, ...existing];
                    const key = KEY_PREFIX + toolId;
                    localStorage.setItem(key, JSON.stringify(merged));
                    resolve(data.records.length);
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = () => reject(new Error('文件读取失败'));
            reader.readAsText(file);
        });
    }

    return {
        getRecords,
        saveRecord,
        deleteRecord,
        clearRecords,
        exportRecords,
        importRecords
    };
})();
