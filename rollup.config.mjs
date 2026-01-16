import swc from '@rollup/plugin-swc';
import { glob } from 'glob';
import path from 'path';

// Custom plugin to handle conditional compilation (#if debug / #else / #endif)
// This is needed because rollup-plugin-strip-code can only remove blocks,
// not do conditional compilation (keep production, remove debug)
function conditionalCompilation() {
  return {
    name: 'conditional-compilation',
    transform(code, id) {
      // Handle //#if debug ... //#else ... //#endif blocks
      // Keep only the production code (between #else and #endif)
      const result = code.replace(
        /\/\/#if debug\n([\s\S]*?)\/\/#else\n([\s\S]*?)\/\/#endif\n?/g,
        (match, debugBlock, prodBlock) => {
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

// Custom plugin to extract userscript headers and move them outside the IIFE
// This is needed because rollup-plugin-shift-header moves comments within the source,
// but doesn't handle comments that need to be outside the IIFE wrapper
function extractUserscriptHeader() {
  const headers = new Map();
  
  return {
    name: 'extract-userscript-header',
    transform(code, id) {
      // Extract the userscript header block (from start to // ==/UserScript==)
      const headerMatch = code.match(/([\s\S]*?\/\/ ==\/UserScript==\n)/);
      if (headerMatch) {
        headers.set(id, headerMatch[1]);
        // Remove header from source (will be added back in generateBundle)
        const codeWithoutHeader = code.substring(headerMatch[0].length);
        return {
          code: codeWithoutHeader,
          map: null
        };
      }
      return null;
    },
    
    generateBundle(options, bundle) {
      // Prepend headers to the output
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type === 'chunk') {
          for (const [id, header] of headers.entries()) {
            if (chunk.facadeModuleId === id) {
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
      // Handle conditional compilation (custom - extends strip-code functionality)
      conditionalCompilation(),
      // Extract userscript header (custom - extends shift-header functionality)
      extractUserscriptHeader(),
      // Compile TypeScript with SWC using @rollup/plugin-swc
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
