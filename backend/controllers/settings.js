import Settings from '../models/Settings';
import config from '../configs/config';

const getSettings = (req, res) => {
    //let { page } = req.query
    //let query = page ? {page: page} : {}
    Settings.find({})
        .lean()
        .exec((err, settings) => {
            if (err) return res.status(500).send({
                error: true,
                message: err.message
            });
            res.send(settings[0]);
        });
};
const get = () => {

    return Settings.find({})
    .lean()
    .exec();
}
const saveSettings = (req, res) => {
    Settings.findOneAndUpdate({}, req.body, {new: true}, (err, values) => {
        if(err) {
            return res.status(500).send({error: true, message: err.message})
        }
        return res.send(values);
    })
}
const initSettings = (req, res) => {
    console.log('Init settings  version: ', config.initialState.settings.version);
    return new Promise(function(resolve) {
            return Settings.remove({}, (err) => {
                if (err) {
                    console.log(err);
                    return res.send('ERR REMOVE ' + err);
                }
                let newSettings = new Settings({
                    admins:['default']
                })
                newSettings.save((err, settings) => {
                    if (err) {
                        console.log(err);
                        return res.send('ERR SAVE ' + err);
                    }
                    if(res) {
                        res.send(settings);
                    }
                    else {
                        resolve ([settings]);
                    }
                });
            });
    });
}

export default {
    initSettings,
    getSettings,
    saveSettings,
    get
};
