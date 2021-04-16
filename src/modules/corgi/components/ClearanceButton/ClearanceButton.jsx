import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '~modules/common';

const ClearanceButtonPropTypes = {
  isAuctionExpired: PropTypes.bool.isRequired,
  isOwner: PropTypes.bool.isRequired,
  isHighestBidder: PropTypes.bool.isRequired,
  isUserBidded: PropTypes.bool.isRequired,
  onClearance: PropTypes.func.isRequired,
};

const ClearanceButton = ({ isAuctionExpired, isOwner, isHighestBidder, isUserBidded, onClearance }) => {
  if (isAuctionExpired && (isOwner || isHighestBidder)) {
    return <Button description='Finish auction' action={onClearance} />;
  }

  if (isUserBidded && !isHighestBidder && !isOwner) {
    return <Button description='Claim my bid back' action={onClearance} />;
  }

  return null;
};

ClearanceButton.propTypes = ClearanceButtonPropTypes;

export default ClearanceButton;
