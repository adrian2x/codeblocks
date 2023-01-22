import algoliasearch from 'algoliasearch/lite'
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

export function Search() {
  return (
    <div className='search-box sm-hide ml4'>
      <InstantSearch searchClient={searchClient} indexName='posts'>
        <SearchBox placeholder='Search' />
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
  let p = hit
  return (
    <article key={p.id} className='post'>
      <a href={`/post/${p.id}`}>
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

function NoResultsBoundary({ children, fallback }) {
  const { results } = useInstantSearch()

  // The `__isArtificial` flag makes sure not to display the No Results message
  // when no hits have been returned yet.
  if (!results.__isArtificial && results.nbHits === 0) {
    return (
      <>
        {fallback}
        <div hidden>{children}</div>
      </>
    )
  }

  return children
}
