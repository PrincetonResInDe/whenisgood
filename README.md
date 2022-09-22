## WhenIsBetter - Resinde




### Installation Steps:
```bash
# clone the repo
git clone https://github.com/PrincetonResInDe/whenisgood
```

if yarn isn't installed, install it [here](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable)
```bash
# install the NodeJS packages required
cd frontend
yarn

# install the python packages required
cd ..
pip install -r requrements.txt
```

### Development Steps:
```bash

# export secrets 
export XXX=YYYY

# build the frontend
cd frontend
yarn build

# serve the frontend
cd ..
python app.py

# whenever a change is made, 
# Ctrl+C to abort running the frontend
python app.py # to run the frontend again
```

### TODO: Publishing Steps:
