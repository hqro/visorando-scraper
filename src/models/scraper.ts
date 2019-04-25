import { isEmpty, isNil, get } from 'lodash'

import { extractBody } from '../helpers/jsdom'
import { parseDate } from '../helpers/date'
import { parseDetails } from '../helpers/details'

const getRegionUrls = async (): Promise<string[]> => {
  const BASE_URL = 'https://www.visorando.com/'
  const document = await extractBody(BASE_URL)
  const scope = document.querySelectorAll('.content-col .module .content-module ul > li > a')

  return Array
    .from(scope)
    .map((element: Element) => element.getAttribute('href') || '')
    .filter(url => !isEmpty(url))
}

const getHikingUrls = async (regionUrl: string): Promise<string[]> => {
  const document = await extractBody(regionUrl)
  const scope = document.querySelectorAll('.content-innerContentWithHeader .rando .rando-title-sansDetail > a')

  return Array
    .from(scope)
    .map((element: Element) => element.getAttribute('href') || '')
    .filter(url => !isEmpty(url))
    .map(url => url.trim())
}

const getHikingDetails = async (hikingUrl: string): Promise<any> => {
  const document = await extractBody(hikingUrl)
  const content = document.querySelector('.innerContentVR')

  if (isNil(content)) return null

  const title = content.querySelector('h1[itemprop="name"]')
  const date = content.querySelector('.rando-date')
  const description = content.querySelector('p')

  const topics = content.querySelector('.liste-topics-blanc-inner')
  const details = (get(topics, 'textContent', '') as string)
    .split('\n')
    .map(line => line.trim())
    .filter(line => !isEmpty(line))
    .map(line => line.split(':').map(el => el.trim()).join(': '))
    .join(' ')

  const aggregateRating = content.querySelector('#topics-rando .topic:first-child .topic-text p[itemprop="aggregateRating"]')
  const rating = (get(aggregateRating, 'textContent', '') as string)
    .split('\n')
    .map(el => el.trim())
    .filter(el => !isEmpty(el))

  return ({
    url: hikingUrl,
    title: (get(title, 'textContent', '') as string).trim(),
    ...parseDate(get(date, 'textContent', '') as string),
    description: get(description, 'textContent', ''),
    details: parseDetails(details),
    rating,
  })
}

export {
  getRegionUrls,
  getHikingUrls,
  getHikingDetails,
}
