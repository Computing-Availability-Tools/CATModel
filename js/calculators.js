const Calculators = (() => {

    function convertFailureRate(value, fromUnit, hoursPerYear = 8760) {
        value = parseFloat(value);
        if (isNaN(value) || value <= 0) return null;

        let mtbf, fit, ppm;

        switch (fromUnit) {
            case 'FIT':
                fit = value;
                mtbf = 1e9 / fit;
                ppm = fit * hoursPerYear / 1e6;
                break;
            case 'MTBF':
                mtbf = value;
                fit = 1e9 / mtbf;
                ppm = hoursPerYear / mtbf;
                break;
            case 'PPM':
                ppm = value;
                mtbf = hoursPerYear / ppm;
                fit = ppm * 1e6 / hoursPerYear;
                break;
            default:
                return null;
        }

        return { FIT: fit, MTBF: mtbf, PPM: ppm };
    }

    function calcAvailability(mtbf, mttr) {
        mtbf = parseFloat(mtbf);
        mttr = parseFloat(mttr);
        if (isNaN(mtbf) || mtbf <= 0 || isNaN(mttr) || mttr < 0) return null;

        const a = mtbf / (mtbf + mttr);
        const hoursPerYear = 8760;
        const downtimePerYear = (1 - a) * hoursPerYear;

        let level = '';
        const nines = -Math.log10(1 - a);
        if (nines >= 5) level = '五个9 (99.999%+)';
        else if (nines >= 4) level = '四个9 (99.99%+)';
        else if (nines >= 3) level = '三个9 (99.9%+)';
        else if (nines >= 2) level = '两个9 (99%+)';
        else level = '< 99%';

        return {
            availability: a,
            availabilityPct: (a * 100).toFixed(6) + '%',
            level: level,
            downtimePerYear: downtimePerYear
        };
    }

    function parseRate(value) {
        if (typeof value === 'string') {
            value = value.trim();
            if (value.endsWith('%')) {
                return parseFloat(value.slice(0, -1)) / 100;
            }
        }
        return parseFloat(value);
    }

    function calcTrainingAvailability(params) {
        const mtbf = parseFloat(params.MTBF);               // 小时
        const tCkpt = parseFloat(params.T_ckpt) / 60;       // 分钟 -> 小时
        const tOverhead = parseFloat(params.T_overhead) / 3600; // 秒 -> 小时
        const mttrAuto = parseFloat(params.MTTR_auto) / 60; // 分钟 -> 小时
        const autoRate = parseRate(params.auto_recovery_rate); // 支持 0.95 或 95%
        const mttrManual = parseFloat(params.MTTR_manual);  // 小时

        if (isNaN(mtbf) || mtbf <= 0 ||
            isNaN(tCkpt) || tCkpt <= 0 ||
            isNaN(tOverhead) || tOverhead < 0 ||
            isNaN(mttrAuto) || mttrAuto < 0 ||
            isNaN(autoRate) || autoRate < 0 || autoRate > 1 ||
            isNaN(mttrManual) || mttrManual < 0) {
            return null;
        }

        const mttrEff = mttrAuto * autoRate + mttrManual * (1 - autoRate);
        const nRetry = Math.exp(tCkpt / mtbf) - 1;
        const rollbackLoss = tCkpt / 2;
        const rollbackTotal = rollbackLoss * nRetry;
        const recoveryTotal = mttrEff * nRetry;
        const failureLoss = rollbackTotal + recoveryTotal;
        const cycleTime = tCkpt + tOverhead + failureLoss;
        const a = tCkpt / cycleTime;

        return {
            availability: a,
            availabilityPct: (a * 100).toFixed(6) + '%',
            nRetry: nRetry,
            mttrEff: mttrEff,
            autoRate: autoRate,
            rollbackLoss: rollbackLoss,
            rollbackTotal: rollbackTotal,
            recoveryTotal: recoveryTotal,
            failureLoss: failureLoss,
            cycleTime: cycleTime,
            effectiveRatio: tCkpt / cycleTime,
            overheadRatio: tOverhead / cycleTime,
            rollbackRatio: rollbackTotal / cycleTime,
            recoveryRatio: recoveryTotal / cycleTime,
            failureRatio: failureLoss / cycleTime
        };
    }

    return {
        convertFailureRate,
        calcAvailability,
        calcTrainingAvailability
    };
})();
