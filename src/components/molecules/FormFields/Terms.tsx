import React, { ReactElement } from 'react'
import { InputProps } from '../../atoms/Input'
import InputElement from '../../atoms/Input/InputElement'
import styles from './Terms.module.css'
import { useSiteMetadata } from '../../../hooks/useSiteMetadata'

export default function Terms(props: InputProps): ReactElement {
  const { appConfig } = useSiteMetadata()
  const termsProps: InputProps = {
    ...props,
    defaultChecked: props.value.toString() === 'true'
  }

  const termsURL =
    appConfig.metadataCacheUri.replace('aquarius.', '') + '/terms'

  return (
    <>
      <a href={termsURL} target="_blank">
        Click here for the Terms &amp; Conditions
      </a>
      <InputElement {...termsProps} type="checkbox" />
    </>
  )
}
