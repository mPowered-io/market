import React, { ReactElement } from 'react'
import { graphql, PageProps } from 'gatsby'
import Page from './Page'
import styles from './PageMarkdown.module.css'
import Container from '../atoms/Container'

export default function PageTemplateMarkdown(props: PageProps): ReactElement {
  const { html, frontmatter, tableOfContents, fields } = (props.data as any)
    .markdownRemark
  const { title, description } = frontmatter
  const { slug } = fields

  return (
    <Page title={title} description={description} uri={props.uri} headerCenter>
      <Container narrow>
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </Container>
    </Page>
  )
}

export const pageQuery = graphql`
  query PageMarkdownBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      tableOfContents(absolute: false)
      frontmatter {
        title
        description
      }
      fields {
        slug
      }
    }
  }
`
