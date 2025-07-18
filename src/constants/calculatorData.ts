// Define types for room dimensions
export type RoomDimensions = { p: number; l: number; };

// Define types for specific room configurations
export type RumahRoomSizes = {
  'K Utama'?: RoomDimensions;
  'K Anak'?: RoomDimensions;
  'KM'?: RoomDimensions;
  'R. Makan'?: RoomDimensions;
  'Dapur'?: RoomDimensions;
  'R Tamu'?: RoomDimensions;
  'R Keluarga'?: RoomDimensions;
  'R Terbuka'?: number; // R Terbuka is calculated differently
};

export type KosRoomSizes = {
  'K Utama'?: RoomDimensions;
  'Gudang'?: RoomDimensions;
  'KM'?: RoomDimensions;
  'R. Makan'?: RoomDimensions;
  'Dapur'?: RoomDimensions;
  'R Tamu'?: RoomDimensions;
  'R Loundry'?: RoomDimensions;
  'R Terbuka'?: number;
};

export type RukoRoomSizes = {
  'K Utama'?: RoomDimensions;
  'K Anak'?: RoomDimensions;
  'KM'?: RoomDimensions;
  'R. Makan'?: RoomDimensions;
  'Dapur'?: RoomDimensions;
  'R Tamu'?: RoomDimensions;
  'R Keluarga'?: RoomDimensions;
  'R Terbuka'?: number;
};

export type GudangRoomSizes = {
  'Ruangan'?: RoomDimensions;
  'KM'?: RoomDimensions;
  'R Terbuka'?: number;
};

// Define the main roomSizes type
export type RoomSizes = {
  'rumah': {
    '<100': RumahRoomSizes;
    '>100': RumahRoomSizes;
    '>200': RumahRoomSizes;
  };
  'kos': {
    'eksekutif': KosRoomSizes;
    'ekonomi': KosRoomSizes;
  };
  'ruko': {
    'siap huni': RukoRoomSizes;
    'kosong': RukoRoomSizes;
  };
  'gudang': {
    'kosong': GudangRoomSizes;
  };
};

// Define types for work item percentages
export type WorkItemPercentagesMap = { [key: string]: number };

export type WorkItemPercentages = {
  'rumah': {
    '<100': WorkItemPercentagesMap;
    '>100': WorkItemPercentagesMap;
    '>200': WorkItemPercentagesMap;
  };
  'kos': {
    'eksekutif': WorkItemPercentagesMap;
    'ekonomi': WorkItemPercentagesMap;
  };
  'ruko': {
    'siap huni': WorkItemPercentagesMap;
    'kosong': WorkItemPercentagesMap;
  };
  'gudang': {
    'kosong': WorkItemPercentagesMap;
  };
};

// Export the constants with their new types
export const roomSizes: RoomSizes = {
  'rumah': {
    '<100': {
      'K Utama': { p: 4, l: 3 },
      'K Anak': { p: 3, l: 2.5 },
      'KM': { p: 1.2, l: 1.5 },
      'R. Makan': { p: 3, l: 2.5 },
      'Dapur': { p: 3, l: 2.5 },
      'R Tamu': { p: 3, l: 2.8 },
      'R Keluarga': { p: 3, l: 3 }
    },
    '>100': {
      'K Utama': { p: 4, l: 4 },
      'K Anak': { p: 3, l: 3 },
      'KM': { p: 2, l: 1.5 },
      'R. Makan': { p: 3, l: 3 },
      'Dapur': { p: 3, l: 2.5 },
      'R Tamu': { p: 4, l: 4 },
      'R Keluarga': { p: 5, l: 4 }
    },
    '>200': {
      'K Utama': { p: 5, l: 5 },
      'K Anak': { p: 3, l: 5 },
      'KM': { p: 2.5, l: 3 },
      'R. Makan': { p: 4, l: 4 },
      'Dapur': { p: 3, l: 4 },
      'R Tamu': { p: 6, l: 6 },
      'R Keluarga': { p: 5, l: 5 }
    }
  },
  'kos': {
    'eksekutif': {
      'K Utama': { p: 3, l: 4 },
      'Gudang': { p: 2, l: 2 },
      'KM': { p: 1.5, l: 1.5 },
      'R. Makan': { p: 3, l: 2.5 },
      'Dapur': { p: 3, l: 2.5 },
      'R Tamu': { p: 4, l: 4 },
      'R Loundry': { p: 3, l: 2.5 }
    },
    'ekonomi': {
      'K Utama': { p: 3, l: 2.5 },
      'Gudang': { p: 2, l: 2 },
      'KM': { p: 1.5, l: 1.2 },
      'R. Makan': { p: 2, l: 2 },
      'Dapur': { p: 2, l: 1.5 },
      'R Tamu': { p: 4, l: 4 },
      'R Loundry': { p: 1.5, l: 1.2 }
    }
  },
  'ruko': {
    'siap huni': {
      'K Utama': { p: 3, l: 4 },
      'K Anak': { p: 3, l: 3 },
      'KM': { p: 1.5, l: 1.5 },
      'R. Makan': { p: 3, l: 3 },
      'Dapur': { p: 3, l: 2 },
      'R Tamu': { p: 4, l: 4 },
      'R Keluarga': { p: 5, l: 4 }
    },
    'kosong': {
      'KM': { p: 1.5, l: 1.5 }
    }
  },
  'gudang': {
    'kosong': {
      'Ruangan': { p: 3, l: 4 },
      'KM': { p: 1.5, l: 1.5 }
    }
  }
};

export const workItemPercentages: WorkItemPercentages = {
  'rumah': {
    '<100': {
      'Pondasi Batu Kali': 0.1,
      'Kolom & Balok Beton Bertulang': 0.25,
      'Dinding Bata Merah': 0.19,
      'Pintu Kayu Solid': 0.035,
      'Jendela Kaca Frame Kayu Solid': 0.04,
      'Lantai Keramik': 0.2,
      'Atap Seng Spandek': 0.073,
      'Plafon Gypsum': 0.037,
      'Cat Standar': 0.03,
      'Sanitair Merk Standar': 0.025,
      'Bouplank': 0.005,
      'Pembersihan Area': 0.015
    },
    '>100': {
      'Pondasi Tapak Beton Bertulang': 0.1,
      'Kolom & Balok Beton Bertulang': 0.25,
      'Dinding Bata Merah': 0.19,
      'Pintu Kayu Solid': 0.035,
      'Jendela Kaca Frame Aluminium': 0.04,
      'Lantai Granit': 0.2,
      'Atap Genteng Metal': 0.073,
      'Plafon Gypsum': 0.037,
      'Cat Medium Quality': 0.03,
      'Sanitair Merk Medium': 0.025,
      'Bouplank': 0.005,
      'Pembersihan Area': 0.015
    },
    '>200': {
      'Pondasi Bored Pile': 0.1,
      'Kolom & Balok Beton Bertulang': 0.25,
      'Dinding Batu Habel': 0.19,
      'Pintu Kayu Solid': 0.035,
      'Jendela Kaca Frame Upvc': 0.04,
      'Lantai Marmer': 0.2,
      'Atap Bitumen': 0.073,
      'Plafon Gypsum': 0.037,
      'Cat High Quality': 0.03,
      'Sanitair Merk High': 0.025,
      'Bouplank': 0.005,
      'Pembersihan Area': 0.015
    }
  },
  'kos': {
    'eksekutif': {
      'Pondasi Tapak Beton Bertulang': 0.1,
      'Kolom & Balok Beton Bertulang': 0.25,
      'Dinding Bata Merah': 0.19,
      'Pintu Kayu Solid': 0.035,
      'Jendela Kaca Frame Upvc': 0.04,
      'Lantai Granit': 0.2,
      'Atap Cor Dak': 0.073,
      'Plafon PVC': 0.037,
      'Cat Medium Quality': 0.03,
      'Sanitair Merk Medium': 0.025,
      'Bouplank': 0.005,
      'Pembersihan Area': 0.015
    },
    'ekonomi': {
      'Pondasi Batu Kali': 0.1,
      'Kolom & Balok Beton Bertulang': 0.25,
      'Dinding Bata Merah': 0.19,
      'Pintu Kayu Solid': 0.035,
      'Jendela Kaca Frame Kayu Solid': 0.04,
      'Lantai Keramik': 0.2,
      'Atap Seng Spandek': 0.073,
      'Plafon PVC': 0.037,
      'Cat Standar Quality': 0.03,
      'Sanitair Merk Standar': 0.025,
      'Bouplank': 0.005,
      'Pembersihan Area': 0.015
    }
  },
  'ruko': {
    'siap huni': {
      'Pondasi Tapak Beton Bertulang': 0.1,
      'Kolom & Balok Beton Bertulang': 0.25,
      'Dinding Bata Merah': 0.19,
      'Pintu Besi Custom': 0.035,
      'Jendela Kaca Frame Aluminium': 0.04,
      'Lantai Keramik': 0.2,
      'Atap Cor Dak': 0.073,
      'Plafon Gypsum': 0.037,
      'Cat Medium Quality': 0.03,
      'Sanitair Merk Medium': 0.025,
      'Bouplank': 0.005,
      'Pembersihan Area': 0.015
    },
    'kosong': {
      'Pondasi Tapak Beton Bertulang': 0.1,
      'Kolom & Balok Beton Bertulang': 0.25,
      'Dinding Bata Merah': 0.19,
      'Pintu Besi Custom': 0.035,
      'Jendela Kaca Frame Aluminium': 0.04,
      'Atap Cor Dak': 0.073,
      'Bouplank': 0.005,
      'Pembersihan Area': 0.015
    }
  },
  'gudang': {
    'kosong': {
      'Pondasi Bored Pile': 0.1,
      'Kolom & Balok Besi WF': 0.287,
      'Dinding Batu Habel': 0.19,
      'Pintu Besi Custom': 0.035,
      'Jendela Kaca Frame Aluminium': 0.04,
      'Lantai Cor Rabat': 0.2,
      'Atap Seng Spandek': 0.073,
      'Cat Standar Quality': 0.03,
      'Sanitair Merk Standar': 0.025,
      'Bouplank': 0.005,
      'Pembersihan Area': 0.015
    }
  }
};

export const baseCosts = {
  'rumah': 3500000,
  'kos': 4500000,
  'ruko': 3000000,
  'gudang': 2500000
};

export const materialCoefs = {
  'standar': 1,
  'menengah': 1.2,
  'mewah': 1.5
};

export const designCoefs = {
  'minimalis': 1,
  'skandinavia': 1.1,
  'tropis': 1.2,
  'modern': 1.25,
  'klasik': 1.65
};
