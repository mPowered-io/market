import React, { ChangeEvent, useState } from 'react'
import Dotdotdot from 'react-dotdotdot'
import slugify from 'slugify'
import classNames from 'classnames/bind'
import PriceUnit from '@shared/Price/PriceUnit'
import External from '@images/external.svg'
import InputElement from '@shared/FormInput/InputElement'
import Loader from '@shared/atoms/Loader'
import styles from './index.module.css'

const cx = classNames.bind(styles)

export interface AssetSelectionAsset {
  did: string
  name: string
  price: string
  checked: boolean
  symbol: string
  parameters: array
}

function Empty() {
  return <div className={styles.empty}>No assets found.</div>
}

export default function AssetSelection({
  assets,
  multiple,
  disabled,
  ...props
}: {
  assets: AssetSelectionAsset[]
  multiple?: boolean
  disabled?: boolean
}): JSX.Element {
  const [searchValue, setSearchValue] = useState('')
  const [selectedAlgo, setSelectedAlgo] = useState('')

  const styleClassesInput = cx({
    input: true,
    [styles.checkbox]: multiple,
    [styles.radio]: !multiple
  })

  function handleSearchInput(e: ChangeEvent<HTMLInputElement>) {
    setSearchValue(e.target.value)
  }

  function handleAlgorithmSelect(e: ClickEvent<HTMLInputElement>) {
    setSelectedAlgo(e.target.value)

    //console.log(e.target.value)
    let asset
    for (let i = 0; i < assets.length; i++) {
      if (assets[i].did === e.target.value) {
        asset = assets[i]
        break
      }
    }
    if (asset.parameters?.length) {
      for (let i = 0; i < asset.parameters.length; i++) {
        console.log(asset.parameters[i])
      }
    }
  }

  function Parameters({ did, params }) {
    if (!Array.isArray(params) || !params.length) {
      return null
    }

    return (
      <div>
        {params.map((param, i) => (
          <div key={i}>
            {param.description && <p>{param.description}</p>}
            <label>{param.label}</label>:&nbsp;
            {param.type === 'text' && (
              <input
                type="text"
                name={param.name}
                defaultValue={param.default}
              />
            )}
            {param.type === 'select' && (
              <select name={param.name} required={param.required}>
                {param.options.map((option, j) => (
                  <option value={Object.keys(option)[0]}>
                    {Object.values(option)[0]}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`${styles.selection} ${disabled ? styles.disabled : ''}`}>
      <InputElement
        type="search"
        name="search"
        size="small"
        placeholder="Search by title, datatoken, or DID..."
        value={searchValue}
        onChange={handleSearchInput}
        className={styles.search}
        disabled={disabled}
      />
      <div className={styles.scroll}>
        {!assets ? (
          <Loader />
        ) : assets && !assets.length ? (
          <Empty />
        ) : (
          assets
            .filter((asset: AssetSelectionAsset) =>
              searchValue !== ''
                ? asset.name
                    .toLowerCase()
                    .includes(searchValue.toLowerCase()) ||
                  asset.did.toLowerCase().includes(searchValue.toLowerCase()) ||
                  asset.symbol.toLowerCase().includes(searchValue.toLowerCase())
                : asset
            )
            .map((asset: AssetSelectionAsset) => (
              <div className={styles.row} key={asset.did}>
                <input
                  id={slugify(asset.did)}
                  type={multiple ? 'checkbox' : 'radio'}
                  className={styleClassesInput + ' ' + styles.params}
                  defaultChecked={asset.checked}
                  {...props}
                  defaultChecked={asset.checked}
                  type={multiple ? 'checkbox' : 'radio'}
                  disabled={disabled}
                  value={asset.did}
                  onClick={handleAlgorithmSelect}
                />
                <label
                  className={styles.label}
                  htmlFor={slugify(asset.did)}
                  title={asset.name}
                >
                  <h3 className={styles.title}>
                    <Dotdotdot clamp={1} tagName="span">
                      {asset.name}
                    </Dotdotdot>
                    <a
                      className={styles.link}
                      href={`/asset/${asset.did}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <External />
                    </a>
                  </h3>

                  <Dotdotdot clamp={1} tagName="code" className={styles.did}>
                    {asset.symbol} | {asset.did}
                  </Dotdotdot>
                  {!multiple &&
                    selectedAlgo == asset.did &&
                    asset.parameters?.length > 0 && (
                      <Parameters did={asset.did} params={asset.parameters} />
                    )}
                </label>

                <PriceUnit
                  price={asset.price}
                  type={asset.price === '0' ? 'free' : undefined}
                  size="small"
                  className={styles.price + ' ' + styles.params}
                  style={{ background: 'yellow' }}
                />
              </div>
            ))
        )}
      </div>
    </div>
  )
}
