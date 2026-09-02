const Converters = (() => {

    function formatNumber(num, decimals = 4) {
        if (num === null || num === undefined || isNaN(num)) return '-';
        if (num === 0) return '0';
        if (Math.abs(num) < 0.0001 || Math.abs(num) >= 1e8) {
            return num.toExponential(decimals);
        }
        return parseFloat(num.toFixed(decimals)).toString();
    }

    function formatHours(hours) {
        if (hours === null || hours === undefined || isNaN(hours)) return '-';
        if (hours < 1 / 3600) return formatNumber(hours * 3600 * 1000, 2) + ' ms';
        if (hours < 1 / 60) return formatNumber(hours * 3600, 2) + ' s';
        if (hours < 1) return formatNumber(hours * 60, 2) + ' min';
        if (hours < 24) return formatNumber(hours, 4) + ' h';
        if (hours < 8760) return formatNumber(hours / 24, 4) + ' d';
        return formatNumber(hours / 8760, 4) + ' y';
    }

    function formatPercent(value) {
        if (value === null || value === undefined || isNaN(value)) return '-';
        return (value * 100).toFixed(6) + '%';
    }

    function formatDateTime(isoStr) {
        const d = new Date(isoStr);
        return d.toLocaleString('zh-CN');
    }

    return {
        formatNumber,
        formatHours,
        formatPercent,
        formatDateTime
    };
})();
