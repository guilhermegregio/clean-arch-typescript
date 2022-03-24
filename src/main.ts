import packJson from '../package.json'

const configure = () => {
  const {name, version} = packJson
  console.log('Configure Person Classification', {name, version})
}

export {configure}
export default configure
