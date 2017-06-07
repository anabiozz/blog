import User from '../models/User';
import configUser from '../configs/config.user';

const saveUser = (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, (err, user) => {
        if (err) {
            return res.status(500).send({ error: true, message: err.message });
        }
        return res.send(user);
    });
};

const get = () => {
    return User.find({})
        .lean()
        .exec();
};

const initUser = (req, res) => {
    console.log('init user');
    return new Promise(function(resolve) {
        return User.remove({}, (err) => {
         if(err) {
            console.log(err);
            return res.send('ERR REMOVE ' + err);
        }
        let newUser = new User(configUser);
        newUser.password = newUser.encryptPassword(newUser.password);
        newUser.save((err, user) => {
            if (err) {
                console.log(err);
                return res.send('ERR SAVE ' + err);
            }
            console.log(user);
            if(res)
                res.send(user);
            else
                resolve( user );
        });
    });
 });
}

export default {
    initUser,
    saveUser,
    get
};
