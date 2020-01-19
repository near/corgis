import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import Creation from '../../creation/creationHome';

const ShowCase = () => {
    let Corgis = corgiArray.map(corgi => {
        return (
            <Link to={{
                pathname: "/showcase",
                hash: corgi.dna
            }} key={corgi.dna}>
                <Creation
                    backgroundColor={corgi.backgroundColor}
                    color={corgi.color}
                    sausage={corgi.sausage}
                    name={corgi.name}
                    owner={corgi.owner}
                    quote={corgi.quote} />
            </Link>)
    })
    return (
        <div className="creations">
            {Corgis}
        </div>)
}

export default withRouter(ShowCase)

//Show Case

const BACKGROUNDCOLOR = {
    green: "rgba(237,241,133,0.50)",
    purple: "rgba(130,117,175,0.50)",
    blue: "rgba(150,228,221,0.50)",
    pink: "#ffb8c6"
}

const COLOR = {
    green: "rgb(90, 179, 121)",
    blue: "rgb(81, 169, 220)",
    orange: "rgb(224, 100, 58)",
    gray: "#004739"
}

const corgiArray = [{
    backgroundColor: BACKGROUNDCOLOR.green,
    color: COLOR.green,
    sausage: "110.5323",
    name: "J.Corg",
    owner: "jstutzman",
    quote: "Does this color make me look fat?",
    rate: "RARE",
    dna: "J9YqhHfklee9FfqxgwzcFQ=="
}, {
    backgroundColor: BACKGROUNDCOLOR.purple,
    color: COLOR.blue,
    sausage: "0.0000",
    name: "Squatty Blu Doggy",
    owner: "icerove",
    quote: "I like a lot of subjects and things about things...",
    rate: "ULTRA RARE",
    dna: "CDbilm1KtiTDj/8uJfsdrw=="
}, {
    backgroundColor: BACKGROUNDCOLOR.blue,
    color: COLOR.orange,
    sausage: "50.5432",
    name: "Squatty Blu Doggy",
    owner: "potato",
    quote: "We know what we are, but know not what we may be",
    rate: "UNCOMMON",
    dna: "Y8deJkWHjAacSgblf0ASWg=="
}, {
    backgroundColor: BACKGROUNDCOLOR.pink,
    color: COLOR.gray,
    sausage: "199.8672",
    name: "Pbellige",
    owner: "icerove",
    quote: "Do you want me? I am rare corgi and have a cool name!",
    rate: "VERY RARE",
    dna: "HjAacSgblm1KtiYqhHfke=="
}]
