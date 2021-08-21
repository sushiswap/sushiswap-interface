import Article from './Article'
import React from 'react'

function Articles({ articles }: { articles: { title?: any; content: any }[] }) {
  return articles.map((article, i) => <Article key={`article-${i}`} title={article.title} content={article.content} />)
}

export default Articles
