import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function MarkdownRenderer({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <h1 className="text-2xl font-bold text-gray-100 mt-8 mb-4 pb-2 border-b border-surface-600">{children}</h1>,
        h2: ({ children }) => <h2 className="text-xl font-semibold text-gray-100 mt-6 mb-3 pb-2 border-b border-surface-600">{children}</h2>,
        h3: ({ children }) => <h3 className="text-lg font-medium text-gray-200 mt-5 mb-2">{children}</h3>,
        h4: ({ children }) => <h4 className="text-base font-medium text-gray-300 mt-4 mb-1">{children}</h4>,
        p: ({ children }) => <p className="text-gray-300 leading-relaxed mb-3">{children}</p>,
        ul: ({ children }) => <ul className="list-disc list-outside text-gray-300 space-y-1 mb-3 ml-5">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-outside text-gray-300 space-y-1 mb-3 ml-5">{children}</ol>,
        li: ({ children }) => <li className="text-gray-300">{children}</li>,
        strong: ({ children }) => <strong className="text-gray-100 font-semibold">{children}</strong>,
        em: ({ children }) => <em className="text-gray-400 italic">{children}</em>,
        blockquote: ({ children }) => <blockquote className="border-l-2 border-accent pl-4 italic text-gray-400 my-3">{children}</blockquote>,
        hr: () => <hr className="border-surface-600 my-6" />,
        table: ({ children }) => (
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full text-sm border border-surface-600">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-surface-700">{children}</thead>,
        th: ({ children }) => <th className="px-3 py-2 text-left text-gray-300 font-medium border-b border-surface-600">{children}</th>,
        td: ({ children }) => <td className="px-3 py-2 text-gray-400 border-b border-surface-700">{children}</td>,
        code: ({ inline, children }) =>
          inline
            ? <code className="px-1.5 py-0.5 rounded bg-surface-700 text-accent-light text-sm font-mono">{children}</code>
            : <pre className="bg-surface-900 border border-surface-600 rounded-lg p-4 overflow-x-auto mb-4"><code className="text-sm text-gray-300 font-mono">{children}</code></pre>,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
