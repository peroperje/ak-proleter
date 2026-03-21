export function formatAthleticScore(
    score: string | null | undefined, 
    unitSymbol: string | null | undefined
): string {
    if (!score) return 'N/A';
    
    // Replace comma with dot for parsing European format
    const normalizedScore = score.trim().replace(',', '.');
    const num = Number(normalizedScore);
    
    if (isNaN(num)) {
        // If it's an unparseable string like "2:01:39" or "DNF"
        // Don't append unit if it looks like a time string (has colons) or contains letters.
        if (unitSymbol && !/[a-zA-Z]$/.test(normalizedScore) && !normalizedScore.includes(':')) {
            return `${normalizedScore} ${unitSymbol}`;
        }
        return score;
    }

    const formatDistance = (n: number) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(n);
    };

    // It's a valid numeric value. Format based on unit standard.
    switch (unitSymbol) {
        case 's':
        case 'ms':
        case 'min':
        case 'h': {
            let seconds = num;
            if (unitSymbol === 'ms') seconds = num / 1000;
            if (unitSymbol === 'min') seconds = num * 60;
            if (unitSymbol === 'h') seconds = num * 3600;
            
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = seconds % 60;
            
            // Track events conventionally use 2 decimal places.
            let sStr = s.toFixed(2);
            
            // Pad seconds if there are minutes or hours
            if (h > 0 || m > 0) {
                if (s < 10) sStr = `0${sStr}`;
            }
            
            if (h > 0) {
                const mStr = m < 10 ? `0${m}` : `${m}`;
                return `${h}:${mStr}:${sStr}`;
            } else if (m > 0) {
                return `${m}:${sStr}`;
            } else {
                return `${sStr}`;
            }
        }
        case 'cm': {
            // High Jump, Pole Vault often stored in cm but displayed in meters (e.g. 205 cm -> 2.05)
            return formatDistance(num / 100);
        }
        case 'm': {
            // Long Jump, Throws (e.g. 8.95 m -> 8.95)
            return formatDistance(num);
        }
        case 'pts':
        case 'cnt': {
            return `${Math.round(num)}`;
        }
        case 'kg': {
             return `${formatDistance(num)} kg`;
        }
        default: {
            return unitSymbol ? `${num} ${unitSymbol}` : `${num}`;
        }
    }
}
