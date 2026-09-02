const App = (() => {

    function renderHistoryList(toolId, onLoad, containerId = 'history-list') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const records = Storage.getRecords(toolId);
        if (records.length === 0) {
            container.innerHTML = '<p class="empty-hint">暂无保存的记录</p>';
            return;
        }

        container.innerHTML = records.map(r => `
            <div class="record-item" data-id="${r.id}">
                <div class="record-info">
                    <span class="record-name">${escapeHtml(r.name)}</span>
                    <span class="record-time">${Converters.formatDateTime(r.createdAt)}</span>
                </div>
                <div class="record-actions">
                    <button class="btn btn-sm btn-primary" onclick="App.loadRecord('${toolId}','${r.id}')">加载</button>
                    <button class="btn btn-sm btn-danger" onclick="App.removeRecord('${toolId}','${r.id}')">删除</button>
                </div>
            </div>
        `).join('');
    }

    function loadRecord(toolId, recordId) {
        const records = Storage.getRecords(toolId);
        const record = records.find(r => r.id === recordId);
        if (!record) return;

        const event = new CustomEvent('record-load', {
            detail: { toolId, record }
        });
        document.dispatchEvent(event);
    }

    function removeRecord(toolId, recordId) {
        if (!confirm('确定要删除这条记录吗？')) return;
        Storage.deleteRecord(toolId, recordId);
        renderHistoryList(toolId);
    }

    function saveCurrentRecord(toolId) {
        const event = new CustomEvent('record-save-request', {
            detail: { toolId }
        });
        document.dispatchEvent(event);
    }

    function handleExport(toolId) {
        Storage.exportRecords(toolId);
    }

    function handleImport(toolId) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
            try {
                const count = await Storage.importRecords(toolId, e.target.files[0]);
                alert(`成功导入 ${count} 条记录`);
                renderHistoryList(toolId);
            } catch (err) {
                alert('导入失败: ' + err.message);
            }
        };
        input.click();
    }

    function handleClear(toolId) {
        if (!confirm('确定要清空所有记录吗？此操作不可恢复。')) return;
        Storage.clearRecords(toolId);
        renderHistoryList(toolId);
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    return {
        renderHistoryList,
        loadRecord,
        removeRecord,
        saveCurrentRecord,
        handleExport,
        handleImport,
        handleClear
    };
})();
