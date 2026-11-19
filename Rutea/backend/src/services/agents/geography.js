const radians = (degrees) => degrees * Math.PI / 180

function distance(first, second) {
  const latitude = radians(second.latitude - first.latitude)
  const longitude = radians(second.longitude - first.longitude)
  const value = Math.sin(latitude / 2) ** 2 + Math.cos(radians(first.latitude)) *
    Math.cos(radians(second.latitude)) * Math.sin(longitude / 2) ** 2
  return Math.round(6371 * 2 * Math.asin(Math.sqrt(Math.min(1, value))) * 10) / 10
}

export function nearbyOrder(places) {
  const remaining = [...places]
  let previous
  const ordered = []
  while (remaining.length) {
    if (previous) remaining.sort((a, b) => distance(previous, a) - distance(previous, b))
    const place = remaining.shift()
    ordered.push({
      name: place.name, description: place.description, url: place.url,
      checked_on: place.checked_on, province_name: place.province_name,
      straightLineKmFromPrevious: previous ? distance(previous, place) : undefined,
    })
    previous = place
  }
  return ordered
}
