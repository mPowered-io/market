import React, { ReactElement, useEffect, useState } from 'react'
import AssetList from '../organisms/AssetList'
import Button from '../atoms/Button'
import Bookmarks from '../molecules/Bookmarks'
import {
  generateBaseQuery,
  getFilterTerm,
  queryMetadata
} from '../../utils/aquarius'
import Permission from '../organisms/Permission'
import {
  getTopAssetsPublishers,
  getHighestLiquidityDatatokens
} from '../../utils/subgraph'
import { DDO, Logger } from '@oceanprotocol/lib'
import { useUserPreferences } from '../../providers/UserPreferences'
import styles from './Home.module.css'
import AccountList from '../organisms/AccountList'
import { useIsMounted } from '../../hooks/useIsMounted'
import { useCancelToken } from '../../hooks/useCancelToken'
import { SearchQuery } from '../../models/aquarius/SearchQuery'
import { SortOptions, SortTermOptions } from '../../models/SortAndFilters'
import { BaseQueryParams } from '../../models/aquarius/BaseQueryParams'
import { PagedAssets } from '../../models/PagedAssets'

async function getQueryHighest(
  chainIds: number[]
): Promise<[SearchQuery, string[]]> {
  const dtList = await getHighestLiquidityDatatokens(chainIds)
  const baseQueryParams = {
    chainIds,
    esPaginationOptions: {
      size: dtList.length > 0 ? dtList.length : 1
    },
    filters: [getFilterTerm('dataToken', dtList)]
  } as BaseQueryParams
  const queryHighest = generateBaseQuery(baseQueryParams)

  return [queryHighest, dtList]
}

function sortElements(items: DDO[], sorted: string[]) {
  items.sort(function (a, b) {
    return (
      sorted.indexOf(a.dataToken.toLowerCase()) -
      sorted.indexOf(b.dataToken.toLowerCase())
    )
  })
  return items
}

function PublishersWithMostSales({
  title,
  action
}: {
  title: ReactElement | string
  action?: ReactElement
}) {
  const { chainIds } = useUserPreferences()
  const [result, setResult] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>()

  useEffect(() => {
    async function init() {
      if (chainIds.length === 0) {
        const result: string[] = []
        setResult(result)
        setLoading(false)
      } else {
        try {
          setLoading(true)
          const publishers = await getTopAssetsPublishers(chainIds)
          setResult(publishers)
          setLoading(false)
        } catch (error) {
          Logger.error(error.message)
        }
      }
    }
    init()
  }, [chainIds])

  return (
    <section className={styles.section}>
      <h3>{title}</h3>
      <AccountList accounts={result} isLoading={loading} />
      {action && action}
    </section>
  )
}

function SectionQueryResult({
  title,
  query,
  action,
  queryData
}: {
  title: ReactElement | string
  query: SearchQuery
  action?: ReactElement
  queryData?: string[]
}) {
  const { chainIds } = useUserPreferences()
  const [result, setResult] = useState<any>()
  const [loading, setLoading] = useState<boolean>()
  const isMounted = useIsMounted()
  const newCancelToken = useCancelToken()
  useEffect(() => {
    async function init() {
      if (chainIds.length === 0) {
        const result: PagedAssets = {
          results: [],
          page: 0,
          totalPages: 0,
          totalResults: 0
        }
        setResult(result)
        setLoading(false)
      } else {
        try {
          setLoading(true)
          const result = await queryMetadata(query, newCancelToken())
          if (!isMounted()) return
          if (queryData && result?.totalResults > 0) {
            const sortedAssets = sortElements(result.results, queryData)
            const overflow = sortedAssets.length - 9
            sortedAssets.splice(sortedAssets.length - overflow, overflow)
            result.results = sortedAssets
          }
          setResult(result)
          setLoading(false)
        } catch (error) {
          Logger.error(error.message)
        }
      }
    }
    init()
  }, [chainIds.length, isMounted, newCancelToken, query, queryData])

  return (
    <section className={styles.section}>
      <h3>{title}</h3>
      <AssetList
        assets={result?.results}
        showPagination={false}
        isLoading={loading}
      />
      {action && action}
    </section>
  )
}

export default function HomePage(): ReactElement {
  const [queryAndDids, setQueryAndDids] = useState<[SearchQuery, string[]]>()
  const [queryLatest, setQueryLatest] = useState<SearchQuery>()
  const { chainIds } = useUserPreferences()

  useEffect(() => {
    getQueryHighest(chainIds).then((results) => {
      setQueryAndDids(results)
    })

    const baseParams = {
      chainIds: chainIds,
      esPaginationOptions: { size: 9 },
      sortOptions: {
        sortBy: SortTermOptions.Created
      } as SortOptions
    } as BaseQueryParams

    setQueryLatest(generateBaseQuery(baseParams))
  }, [chainIds])

  return (
    <Permission eventType="browse">
      <>
        <div className={styles.explore}>
          <a
            href="/search?sort=_score&sortOrder=desc&text=weather"
            class="col text-decoration-none text-dark py-2"
          >
            <span
              class="fas fa-cloud"
              style={{ color: 'silver' }}
              aria-hidden="true"
            ></span>
            <h5>Weather</h5>
          </a>
          <a
            href="/search?sort=_score&sortOrder=desc&text=fisheries"
            class="col text-decoration-none text-dark py-2"
          >
            <span
              class="fas fa-fish"
              style={{ color: 'seagreen' }}
              aria-hidden="true"
            ></span>
            <h5>Fisheries</h5>
          </a>
          <a
            href="/search?sort=_score&sortOrder=desc&text=offshore"
            class="col text-decoration-none text-dark py-2"
          >
            <span
              class="fas fa-wind"
              style={{ color: 'midnightblue' }}
              aria-hidden="true"
            ></span>
            <h5>Offshore</h5>
          </a>
          <a
            href="/search?sort=_score&sortOrder=desc&text=aquaculture"
            class="col text-decoration-none text-dark py-2"
          >
            <span
              class="fas fa-water"
              style={{ color: 'aquamarine' }}
              aria-hidden="true"
            ></span>
            <h5>Aquaculture</h5>
          </a>
          <a
            href="/search?sort=_score&sortOrder=desc&text=shipping"
            class="col text-decoration-none text-dark py-2"
          >
            <span
              class="fas fa-anchor"
              style={{ color: 'indigo' }}
              aria-hidden="true"
            ></span>
            <h5>Shipping</h5>
          </a>
          <a
            href="/search?sort=_score&sortOrder=desc&text=tourism"
            class="col text-decoration-none text-dark py-2"
          >
            <span
              class="fas fa-ship"
              style={{ color: 'Goldenrod' }}
              aria-hidden="true"
            ></span>
            <h5>Tourism</h5>
          </a>
          <a
            href="/search?sort=_score&sortOrder=desc&text=bioresources"
            class="col text-decoration-none text-dark py-2"
          >
            <span
              class="fas fa-dna"
              style={{ color: 'green' }}
              aria-hidden="true"
            ></span>
            <h5>Bioresources</h5>
          </a>
          <a
            href="/search?sort=_score&sortOrder=desc&text=defence"
            class="col text-decoration-none text-dark py-2"
          >
            <span
              class="fas fa-satellite"
              style={{ color: 'firebrick' }}
              aria-hidden="true"
            ></span>
            <h5>Defence</h5>
          </a>
        </div>

        {queryLatest && (
          <SectionQueryResult
            title="Recently Published"
            query={queryLatest}
            action={
              <Button style="text" to="/search?sort=created&sortOrder=desc">
                All data sets and algorithms →
              </Button>
            }
          />
        )}
      </>
    </Permission>
  )
}
