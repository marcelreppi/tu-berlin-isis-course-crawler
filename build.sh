npm run build

cd build
zip -r ../tu-berlin-isis-course-crawler .
cd ..

# Make zip of all the code for updating the extension
zip -r ./tu-berlin-isis-course-crawler-code extension webpack.config.js package.json README.md
