import packJson from '../package.json'

const configure = () => {
  const {name, version} = packJson

  //eslint-disable-next-line no-console
  console.log('Configure Person Classification', {name, version})
}

export {configure}
export default configure
