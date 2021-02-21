import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';

import './GenerationPage.scss';

import classNames from 'classnames';

import { ContractContext } from '~contexts';

import { GenerationAnimation, GenerationForm, GenerationScreen } from '~modules/generation/components';

const GenerationPage = () => {
  const { creating, created } = useContext(ContractContext);

  if (creating) {
    return <GenerationAnimation />;
  }

  if (created) {
    return <Redirect to='/account' />;
  }

  return (
    <div className='generation'>
      <h1 className='generation__title'>Create a Corgi</h1>

      <div className='generation__field'>
        <div className={classNames('generation__area', 'generation__form')}>
          <GenerationForm />
        </div>

        <div className={classNames('generation__area', 'generation__screen')}>
          <GenerationScreen />
        </div>
      </div>

      <div className='generation__footer'>
        <p className='generation__description'>
          This will create a one-of-a-kind Corgi that will develop a unique size and thought process. The size it grows
          to will untimately determine it’s value
        </p>
      </div>
    </div>
  );
};

export default GenerationPage;
