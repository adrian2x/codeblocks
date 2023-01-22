import algoliasearch from 'algoliasearch/lite'
import { ReactNode } from 'react'
import {
  Highlight,
  Hits,
  InstantSearch,
  SearchBox,
  useInstantSearch
} from 'react-instantsearch-hooks-web'
import { appId, searchToken } from './api'
import './search.scss'

const algoliaClient = algoliasearch(appId, searchToken)

const searchClient: typeof algoliaClient = {
  ...algoliaClient,
  search(requests: any) {
    return algoliaClient.search(requests)
  }
}

let timerId: any

function debouncedQuery(query: any, search: any) {
  if (timerId) {
    clearTimeout(timerId)
  }

  timerId = setTimeout(() => search(query), 100)
}

export function Search() {
  return (
    <div className='search-box sm-hide ml4'>
      <InstantSearch searchClient={searchClient} indexName='posts'>
        <SearchBox placeholder='Search' queryHook={debouncedQuery} />
        <div className='absolute'>
          <EmptyQueryBoundary fallback={null}>
            <NoResultsBoundary fallback={null}>
              <Hits hitComponent={Hit} />
            </NoResultsBoundary>
          </EmptyQueryBoundary>
        </div>
      </InstantSearch>
    </div>
  )
}

function Hit({ hit }: { hit: any }) {
  return (
    <article key={hit.id} className='post'>
      <a href={`/post/${hit.id}`}>
        <div class='flex flex-column flex-1'>
          <h1 className='title'>
            <Highlight attribute='title' hit={hit} />
          </h1>
          <p>
            <small>{hit.description}</small>
            {/* <Snippet hit={hit} attribute='description' /> */}
          </p>
        </div>
      </a>
    </article>
  )
}

function EmptyQueryBoundary({ children, fallback }: any) {
  const { indexUiState } = useInstantSearch()

  if (!indexUiState.query) {
    return fallback
  }

  return children
}

function NoResultsBoundary({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const { results } = useInstantSearch()

  // The `__isArtificial` flag makes sure not to display the No Results message
  // when no hits have been returned yet.
  let noMatches = !results.__isArtificial && results.nbHits === 0
  if (noMatches) {
    return (
      <>
        {fallback}
        <div hidden>{children}</div>
      </>
    )
  }

  return children
}
