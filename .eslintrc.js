module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'react-app',
        'plugin:import/typescript',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended'
    ],
    parserOptions: {
        ecmaVersion: 2020,
        ecmaFeatures: {
            jsx: true
        },
        sourceType: 'module'
    },
    ignorePatterns: ['node_modules/**/*'],
    rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'import/no-cycle': 'error',
        'no-extend-native': 'off',
        'react/prop-types': 'off',
        'react/display-name': 'off',
        'prettier/prettier': 'off',
        'prefer-const': 'warn'
    },
    settings: {
        react: {
            version: 'detect'
        }
    }
}
