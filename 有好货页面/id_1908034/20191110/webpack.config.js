module.exports = {
    entry: "./script.js",
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [['babel-plugin-transform-react-jsx', {pragma: "create"}]]
                    }
                }
            },
            {
                test: /\.component$/,
                use: {
                    loader: require.resolve('./component-loader.js')
                }
            },
            {
                test: /\.css$/i,
                use: {
                    loader: require.resolve('./component-css-loader.js')
                },
            },
        ]
    },
    mode: "development",
    devServer: {
        contentBase: "./dist",
        hot: true
    },
    optimization: {
        minimize: false
    }
};