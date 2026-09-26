import React from 'react';
import {Composition} from 'remotion';
import {AwsMlQ01FastFile} from './videos/q01/AwsMlQ01FastFile';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="Q01-FastFile"
        component={AwsMlQ01FastFile}
        durationInFrames={1621}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
