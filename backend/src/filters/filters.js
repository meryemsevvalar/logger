const applyFilters = (log, filters) => {
    // Filtrelerin her birini kontrol et
    for (const key in filters) {
        // Eğer log özelliği filtre değeriyle eşleşmiyorsa false dön
        if (log[key] !== filters[key]) {
            return false;
        }
    }
    
    // Tüm filtreler eşleşiyorsa true dön
    return true;
};

module.exports = applyFilters;
