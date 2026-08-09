// Specialty Coffee Grinders Database & Click Converter Ranges

export const GRINDERS = [
  {
    id: 'kingrinder-k6',
    name: 'Kingrinder K6',
    type: 'Manual Hand Grinder',
    burr: '48mm Heptagonal Stainless',
    clickStepMicrons: 16,
    ranges: {
      espresso: { min: 30, max: 45, recommended: 38 },
      mokapot: { min: 45, max: 55, recommended: 50 },
      v60: { min: 55, max: 70, recommended: 60 },
      frenchpress: { min: 75, max: 95, recommended: 85 }
    }
  },
  {
    id: 'timemore-c3',
    name: 'Timemore C3',
    type: 'Manual Hand Grinder',
    burr: '38mm S2C Steel',
    clickStepMicrons: 25,
    ranges: {
      espresso: { min: 7, max: 9, recommended: 8 },
      mokapot: { min: 10, max: 12, recommended: 11 },
      v60: { min: 13, max: 16, recommended: 14 },
      frenchpress: { min: 18, max: 22, recommended: 20 }
    }
  },
  {
    id: 'baratza-encore-esp',
    name: 'Baratza Encore ESP',
    type: 'Electric Conical Burr',
    burr: '40mm M2 Conical Steel',
    clickStepMicrons: 20,
    ranges: {
      espresso: { min: 10, max: 18, recommended: 15 },
      mokapot: { min: 19, max: 23, recommended: 21 },
      v60: { min: 24, max: 29, recommended: 26 },
      frenchpress: { min: 30, max: 36, recommended: 33 }
    }
  },
  {
    id: 'comandante-c40',
    name: 'Comandante C40 MK4',
    type: 'Manual Hand Grinder',
    burr: 'Nitrat-hardened Stainless Steel',
    clickStepMicrons: 30,
    ranges: {
      espresso: { min: 10, max: 15, recommended: 12 },
      mokapot: { min: 16, max: 20, recommended: 18 },
      v60: { min: 21, max: 27, recommended: 24 },
      frenchpress: { min: 28, max: 34, recommended: 30 }
    }
  },
  {
    id: 'fellow-ode-gen2',
    name: 'Fellow Ode Gen 2',
    type: 'Electric Flat Burr',
    burr: '64mm Stainless Flat',
    clickStepMicrons: 25,
    ranges: {
      espresso: { min: 1, max: 1, recommended: 1 }, // Not for espresso
      mokapot: { min: 2, max: 3, recommended: 3 },
      v60: { min: 4, max: 6, recommended: 5 },
      frenchpress: { min: 7, max: 9, recommended: 8 }
    }
  },
  {
    id: '1zpresso-jx-pro',
    name: '1Zpresso JX-Pro',
    type: 'Manual Hand Grinder',
    burr: '48mm Conical Steel',
    clickStepMicrons: 12.5,
    ranges: {
      espresso: { min: 12, max: 16, recommended: 14 },
      mokapot: { min: 22, max: 28, recommended: 25 },
      v60: { min: 30, max: 38, recommended: 34 },
      frenchpress: { min: 40, max: 48, recommended: 44 }
    }
  }
];

export function getGrinderById(id) {
  return GRINDERS.find(g => g.id === id) || GRINDERS[0];
}
