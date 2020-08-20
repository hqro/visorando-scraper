import { get, isEqual, toNumber } from 'lodash'

import { Details } from '../types'

const parseDetails = (details: string): Details => {
  const [lat, lng] = (details
    .match(/Départ:\s+([N|S]\s\d+.\d+)°\s\/\s([E|O]\s\d+.\d+)°/) as string[])
    .slice(1, 3)
    .map(el => {
      const [cardinal, value] = el.split(/\s/)

      return (cardinal.startsWith('S') || cardinal.startsWith('O'))
        ? toNumber('-' + value)
        : toNumber(value)
    })

  return {
    ign: get(details.match(/Ref.\s+(\d+[A-Z]{2})/), '[1]'),
    duration: get(details.match(/Durée moyenne:\s+(\d+h\d{2})\[\?\]/), '[1]'),
    distance: parseFloat(get(details.match(/Distance:\s+(\d+.?\d?\d?)km/), '[1]', 0)),
    vertical: {
      rise: parseFloat(get(details.match(/Dénivelé positif:\s+(\d+)m/), '[1]', 0)),
      drop: parseFloat(get(details.match(/Dénivelé négatif:\s+(\d+)m/), '[1]', 0)),
    },
    altitude: {
      high: parseFloat(get(details.match(/Point haut:\s+(\d+)m/), '[1]', 0)),
      low: parseFloat(get(details.match(/Point bas:\s+(\d+)m/), '[1]', 0)),
    },
    difficulty: get(details.match(/Difficulté:\s+(\w+)/), '[1]'),
    loop: isEqual(get(details.match(/Retour point de départ:\s+([Oo]ui|[Nn]on)/), '[1]'), 'Oui'),
    type: get(details.match(/(A pied|A VTT|En raquettes à neige|En cyclo-route)/), '[0]', 'A pied'),
    region: get(details.match(/Région:\s+(.+) Commune/), '[1]', undefined),
    city: get(details.match(/Commune:\s+(.+)\s\(\d+\)/), '[1]'),
    zipCode: parseInt(get(details.match(/Commune:\s+.+(\d{5})/), '[1]'), 10),
    location: { type: 'Point', coordinates: [lng, lat] },
  }
}

export {
  parseDetails,
}
