const xpData = [50, 148, 302, 520, 810, 1180, 1638, 2192, 2850, 3620, 
    4510, 5528, 6682, 7980, 9430, 11040, 12818, 14772, 16910, 19240, 
    21770, 24508, 27462, 30640, 34050, 37700, 41598, 45752, 50170, 54860, 
    59830, 65088, 70642, 76500, 82670]

const vehicles = [
    {
        'name': 'Wagon CRX',
        'look': 
`          . ‾‾‾‾‾/ ' . 
 ___────'O────  / ───  '┐
'==/‾‾‾\\=.======.=/‾‾‾\\=└┐
'‾‾\\___/‾‾‾‾‾‾‾'‾‾\\___/‾'`,
    },
    {
        'name': 'Ezno 613',
        'look': 
`           .‾‾/‾‾‾' . 
  ___─────'D──│ ──────'──┐
/==/‾‾‾\\ .====.== /‾‾‾\\==_|
'‾‾\\___/‾‾‾‾‾‾‾'‾‾\\___/‾‾ `,
    },
]

const tiers = [
    {
        'name': 'Common',
        'part1': `┌─────┐`,
        'part2': `│`,
        'part3': `└─────┘`,
    },
    {
        'name': 'Rare',
        'part1': `┌─────┐`,
        'part2': `│`,
        'part3': `└─═○═─┘`,
    },
    {
        'name': 'Cutting-edge',
        'part1': `┌─────┐`,
        'part2': `│`,
        'part3': `└═≡□≡═┘`,
    },
    {
        'name': 'Unique',
        'part1': `╔─────╗`,
        'part2': `│`,
        'part3': `╚═≡▲≡═╝`,
    },
    {
        'name': 'Prototype',
        'part1': `╔─────╗`,
        'part2': `║`,
        'part3': `╚≡≡◘≡≡╝`,
    },
]

module.exports.getxpData = () => {
    return xpData
}

module.exports.getCars = () => {
    return vehicles
}

module.exports.getTiers = () => {
    return tiers
}