Rectangles with 0.5px black borders
Gradient from white to 200, 200, 200 from top to bottom edges
Group all the objects
Drop shadow at 0, 0 with 0.5 px blur at 100% opacity

for i in *.svg; do
    if ! [[ $i =~ " " ]]; then
        inkscape --export-png=${i%.*}.png --without-gui $i
    fi
done
for i in dcm diag-camera diag-stick-camera filter-stick3 hfm; do 
    convert -flop $i.png ${i}_flipped.png
done
