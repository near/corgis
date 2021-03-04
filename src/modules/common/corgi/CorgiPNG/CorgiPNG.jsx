import React, { useContext, useEffect, useRef, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';

import { ContractContext } from '~contexts/';

import { CorgiSVG } from '~modules/common';

import { SAUSAGE } from '~constants/corgi';

const CorgiPNG = () => {
  const { getCorgi } = useContext(ContractContext);

  const {
    params: { id },
  } = useRouteMatch();

  const [corgi, setCorgi] = useState(null);
  const [сorgiPng, setCorgiPng] = useState('');

  const svgRef = useRef();

  const convertToPng = async () => {
    if (svgRef && svgRef.current) {
      setCorgiPng(await svgRef.current.convertToPng(corgi.name));
    }
  };

  useEffect(() => {
    if (id) {
      getCorgi(id).then((corgiRes) => setCorgi(corgiRes));
    }
  }, [id]);

  useEffect(() => {
    if (corgi) {
      convertToPng();
    }
  }, [corgi]);

  return (
    <div>
      {corgi && (
        <div style={{ display: 'none' }}>
          <CorgiSVG
            color={corgi.color}
            sausage={SAUSAGE[corgi.rate] || SAUSAGE.COMMON}
            name={corgi.name}
            ref={svgRef}
          />
        </div>
      )}

      {сorgiPng && <img src={сorgiPng} alt='' />}
    </div>
  );
};

export default CorgiPNG;
