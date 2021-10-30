import React from 'react'

import Article from './Article'

function Articles({ articles }: { articles: { title?: any; content: any }[] }) {
  return articles.map((article, i) => <Article key={`article-${i}`} title={article.title} content={article.content} />)
}

export default Articles
