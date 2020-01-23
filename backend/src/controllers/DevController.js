const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray')
// Operações comuns de Controllers
//index, show, store, update, destroy

module.exports = {
  async store(request, response) {
    const {
      github_username,
      techs,
      longitude,
      latitude
    } = request.body;

    let dev = await Dev.findOne({
      github_username
    })

    if (!dev) {


      const apiresponse = await axios.get(`https://api.github.com/users/${github_username}`);
      const {
        name = login, avatar_url, bio
      } = apiresponse.data;


      const techsArray = parseStringAsArray(techs);
      console.log(techsArray);

      const location = {
        type: 'Point',
        coordinates: [longitude, latitude]
      }
      const dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
      })

      return response.json(dev);

    }

    else {
      return response.json({ message : "Usuario já cadastrado!"});
    }


  },

  async index(request, response){
    const devs = await Dev.find();

    return response.json(devs);
  }
};
