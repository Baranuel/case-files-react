export const editorStyles = {
    DEFAULT: {
        css: {
          color: '#4a4643',
          p: {
              fontSize: '1.15rem',
              lineHeight: '1.5rem',
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              color: '#4a4643',
          },
          h1: {
              color: '#8B4513',
              fontWeight: '600',
              marginTop: '2rem',
              marginBottom: '0.5rem',
          },
          h2: {
              color: '#8B4513',
              fontWeight: '600',
              marginTop: '2rem',
              marginBottom: '0.5rem',
          },
          h3: {
              color: '#8B4513',
              fontWeight: '600',
              marginTop: '2rem',
              marginBottom: '0.5rem',
          },
          ul: {
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
              '> li': {
                  fontSize: '1.15rem',
                  lineHeight: '1.2rem',
                  marginBottom: '0.5rem',
                  color: '#4a4643',
                  '&::marker': {
                      color: '#B4540A',
                  },
              },
          },
          blockquote: {
              fontStyle: 'italic',
              backgroundColor: '#FFFFFF',
              color: '#8B4513',
              borderLeftColor: '#B4540A',
              borderLeftWidth: '0.25rem',
              padding: '0.75rem 1rem',
              margin: '0.5rem 0',
              marginTop: '2rem',
              borderRadius: '0.25rem',
              quotes: '"\\201C""\\201D""\\2018""\\2019"',
              '> p': {
                  marginTop: '0.5rem',
                  marginBottom: '0.5rem',
                  color: '#8B4513',
              }
          },
          a: {
              color: '#B4540A',
              '&:hover': {
                  color: '#8B4513',
              },
          },
          hr: {
              borderColor: '#D4B492',
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
          },
          strong: {
              color: '#8B4513',
              fontWeight: '600',
          },
          code: {
              '> span': {
                  backgroundColor: '#2C2420',
                  color: '#FFF0DF',
              },
              '&::before': {
                  display: 'none',
              },
              '&::after': {
                  display: 'none',
              },
              padding: '0.2rem 0.4rem',
              borderRadius: '0.2rem',
              fontSize: '0.9em',
              backgroundColor: '#2C2420',
              color: '#FFF0DF',
          }
        },
    },
}