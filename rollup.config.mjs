import swc from '@rollup/plugin-swc';
import { glob } from 'glob';
import path from 'path';
import fs from 'fs';

// Custom plugin to handle conditional compilation (#if debug / #else / #endif)
function conditionalCompilation() {
  return {
    name: 'conditional-compilation',
    transform(code, id) {
      // Remove debug sections and keep production sections
      // Pattern matches:
      // //#if debug
      // ... (debug code with #@ prefix - commented out)
      // //#else
      // ... (production code)
      // //#endif
      
      const result = code.replace(
        /\/\/#if debug\n([\s\S]*?)\/\/#else\n([\s\S]*?)\/\/#endif\n?/g,
        (match, debugBlock, prodBlock) => {
          // Return only the production block (between #else and #endif)
          return prodBlock;
        }
      );
      
      return {
        code: result,
        map: null
      };
    }
  };
}

// Custom plugin to extract and preserve userscript headers
function extractHeader() {
  const headers = new Map();
  
  return {
    name: 'extract-header',
    transform(code, id) {
      // Extract the userscript header block (from start to // ==/UserScript==)
      const headerMatch = code.match(/([\s\S]*?\/\/ ==\/UserScript==\n)/);
      if (headerMatch) {
        headers.set(id, headerMatch[1]);
        // Remove header from source for now (will be added back as banner)
        const codeWithoutHeader = code.substring(headerMatch[0].length);
        return {
          code: codeWithoutHeader,
          map: null
        };
      }
      return null;
    },
    
    generateBundle(options, bundle) {
      // Add headers back to each chunk
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type === 'chunk') {
          // Find the corresponding header
          for (const [id, header] of headers.entries()) {
            if (chunk.facadeModuleId === id) {
              // Prepend header to the code
              chunk.code = header + chunk.code;
              break;
            }
          }
        }
      }
    }
  };
}

// Find all .user.ts files
const inputFiles = glob.sync('**/*.user.ts', {
  ignore: ['node_modules/**', '**/node_modules/**']
});

// Create a configuration for each userscript file
const configs = inputFiles.map(input => {
  const dir = path.dirname(input);
  const fileName = path.basename(input, '.ts');
  
  return {
    input: input,
    output: {
      file: path.join(dir, fileName + '.js'),
      format: 'iife',
      sourcemap: true
    },
    plugins: [
      // Handle conditional compilation
      conditionalCompilation(),
      // Extract header before compilation
      extractHeader(),
      // Compile TypeScript with SWC
      swc({
        swc: {
          jsc: {
            parser: {
              syntax: 'typescript'
            },
            target: 'esnext',
            minify: {
              format: {
                comments: 'all'
              }
            }
          },
          minify: true,
          sourceMaps: true
        },
        // Don't read .swcrc file, use inline config only
        configFile: false
      })
    ]
  };
});

export default configs;
