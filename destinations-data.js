// Comprehensive destinations data for Oasis Travel & Tourism
const destinationsData = {
    // South East Asia
    'southeast-asia': [
        { name: 'Malaysia', country: 'Malaysia', price: 699, code: 'KUL', description: 'Truly Asia - diverse cultures and natural beauty' },
        { name: 'Thailand', country: 'Thailand', price: 799, code: 'BKK', description: 'Land of smiles with beautiful temples and beaches' },
        { name: 'Singapore', country: 'Singapore', price: 899, code: 'SIN', description: 'Modern city-state with amazing food and culture' },
        { name: 'Indonesia', country: 'Indonesia', price: 649, code: 'CGK', description: 'Thousands of islands with rich culture' },
        { name: 'Langkawi', country: 'Malaysia', price: 599, code: 'LGK', description: 'Tropical paradise with pristine beaches' },
        { name: 'Bintan', country: 'Indonesia', price: 549, code: 'TNJ', description: 'Beautiful island getaway near Singapore' },
        { name: 'Cambodia', country: 'Cambodia', price: 499, code: 'PNH', description: 'Ancient temples and rich Khmer heritage' },
        { name: 'Vietnam', country: 'Vietnam', price: 579, code: 'SGN', description: 'Stunning landscapes and vibrant culture' },
        { name: 'Philippines', country: 'Philippines', price: 629, code: 'MNL', description: 'Beautiful archipelago with friendly people' }
    ],
    
    // Middle East
    'middle-east': [
        { name: 'Dubai', country: 'UAE', price: 899, code: 'DXB', description: 'Luxury and adventure in the desert' },
        { name: 'Sharjah', country: 'UAE', price: 799, code: 'SHJ', description: 'Cultural capital of the UAE' },
        { name: 'Ajman', country: 'UAE', price: 749, code: 'AJM', description: 'Peaceful emirate with beautiful beaches' },
        { name: 'Abu Dhabi', country: 'UAE', price: 949, code: 'AUH', description: 'Capital city with modern attractions' },
        { name: 'Ras Al Khaimah', country: 'UAE', price: 699, code: 'RKT', description: 'Adventure and nature in the UAE' },
        { name: 'Umm Al Quwain', country: 'UAE', price: 649, code: 'UAQ', description: 'Hidden gem of the Emirates' },
        { name: 'Jordan', country: 'Jordan', price: 1099, code: 'AMM', description: 'Ancient Petra and desert landscapes' },
        { name: 'Lebanon', country: 'Lebanon', price: 999, code: 'BEY', description: 'Paris of the Middle East' },
        { name: 'Oman', country: 'Oman', price: 899, code: 'MCT', description: 'Sultanate with stunning landscapes' },
        { name: 'Qatar', country: 'Qatar', price: 999, code: 'DOH', description: 'Modern architecture and rich culture' },
        { name: 'Saudi Arabia', country: 'Saudi Arabia', price: 1199, code: 'RUH', description: 'Kingdom with ancient history' },
        { name: 'Turkey', country: 'Turkey', price: 1199, code: 'IST', description: 'Bridge between Europe and Asia' }
    ],
    
    // Other Asia
    'other-asia': [
        { name: 'China', country: 'China', price: 1299, code: 'PEK', description: 'Ancient civilization with modern cities' },
        { name: 'Hong Kong', country: 'Hong Kong', price: 1199, code: 'HKG', description: 'East meets West in this vibrant city' },
        { name: 'Macau', country: 'Macau', price: 999, code: 'MFM', description: 'Las Vegas of Asia with Portuguese heritage' },
        { name: 'Japan', country: 'Japan', price: 1599, code: 'NRT', description: 'Land of rising sun and cherry blossoms' },
        { name: 'Sri Lanka', country: 'Sri Lanka', price: 749, code: 'CMB', description: 'Pearl of the Indian Ocean' }
    ],
    
    // Central Asian Countries
    'central-asia': [
        { name: 'Kazakhstan', country: 'Kazakhstan', price: 999, code: 'ALA', description: 'Heart of Central Asia with nomadic heritage' },
        { name: 'Kyrgyzstan', country: 'Kyrgyzstan', price: 799, code: 'FRU', description: 'Mountain landscapes and nomadic culture' },
        { name: 'Tajikistan', country: 'Tajikistan', price: 899, code: 'DYU', description: 'Roof of the world with stunning peaks' },
        { name: 'Turkmenistan', country: 'Turkmenistan', price: 949, code: 'ASB', description: 'Desert country with unique culture' },
        { name: 'Uzbekistan', country: 'Uzbekistan', price: 899, code: 'TAS', description: 'Silk Road cities and Islamic architecture' }
    ],
    
    // Europe & Others
    'europe-others': [
        { name: 'Europe', country: 'Multiple Countries', price: 1899, code: 'EUR', description: 'Grand tour of European capitals' },
        { name: 'United Kingdom', country: 'UK', price: 1599, code: 'LHR', description: 'Historic castles and modern cities' },
        { name: 'USA', country: 'USA', price: 1799, code: 'JFK', description: 'Land of dreams and endless possibilities' },
        { name: 'Australia', country: 'Australia', price: 2199, code: 'SYD', description: 'Unique wildlife and stunning landscapes' },
        { name: 'New Zealand', country: 'New Zealand', price: 2299, code: 'AKL', description: 'Adventure capital with breathtaking scenery' },
        { name: 'South Africa', country: 'South Africa', price: 1899, code: 'CPT', description: 'Rainbow nation with diverse wildlife' },
        { name: 'Kenya', country: 'Kenya', price: 1699, code: 'NBO', description: 'Safari adventures and Maasai culture' },
        { name: 'Madagascar', country: 'Madagascar', price: 1799, code: 'TNR', description: 'Unique island with endemic species' }
    ],
    
    // Islands
    'islands': [
        { name: 'Mauritius', country: 'Mauritius', price: 1899, code: 'MRU', description: 'Tropical paradise in the Indian Ocean' },
        { name: 'Maldives', country: 'Maldives', price: 2299, code: 'MLE', description: 'Paradise on earth with crystal waters' },
        { name: 'Seychelles', country: 'Seychelles', price: 2499, code: 'SEZ', description: 'Pristine beaches and unique wildlife' },
        { name: 'Andaman Islands', country: 'India', price: 899, code: 'IXZ', description: 'Tropical islands with pristine beaches' },
        { name: 'Lakshadweep', country: 'India', price: 999, code: 'AGX', description: 'Coral islands with pristine beaches' }
    ],
    
    // Indian Subcontinent
    'indian-subcontinent': [
        { name: 'India', country: 'India', price: 599, code: 'DEL', description: 'Incredible diversity and rich heritage' },
        { name: 'Nepal', country: 'Nepal', price: 699, code: 'KTM', description: 'Home to the Himalayas and Mount Everest' },
        { name: 'Bhutan', country: 'Bhutan', price: 1299, code: 'PBH', description: 'Last Shangri-La with pristine culture' }
    ]
};

// Function to get all destinations as a flat array
function getAllDestinations() {
    const allDestinations = [];
    Object.keys(destinationsData).forEach(region => {
        destinationsData[region].forEach(destination => {
            allDestinations.push({
                ...destination,
                region: region,
                type: getDestinationType(destination.name, destination.country)
            });
        });
    });
    return allDestinations;
}

// Function to determine destination type
function getDestinationType(name, country) {
    if (name.includes('Island') || ['Maldives', 'Mauritius', 'Seychelles'].includes(country)) {
        return 'Island';
    }
    if (country === 'Multiple Countries' || name === 'Europe') {
        return 'Region';
    }
    if (name.includes(',') || ['Dubai', 'Singapore', 'Hong Kong'].includes(name)) {
        return 'City';
    }
    return 'Country';
}

// Function to get destinations by region
function getDestinationsByRegion(region) {
    return destinationsData[region] || [];
}

// Function to search destinations
function searchDestinations(query) {
    const allDestinations = getAllDestinations();
    return allDestinations.filter(dest => 
        dest.name.toLowerCase().includes(query.toLowerCase()) ||
        dest.country.toLowerCase().includes(query.toLowerCase()) ||
        dest.description.toLowerCase().includes(query.toLowerCase())
    );
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        destinationsData,
        getAllDestinations,
        getDestinationsByRegion,
        searchDestinations
    };
}