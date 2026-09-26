import React from 'react';
import {Composition} from 'remotion';
import {AwsMlQ01FastFile} from './videos/q01/AwsMlQ01FastFile';
import {AwsMlQ02Recall} from './videos/q02/AwsMlQ02Recall';
import {AwsMlQ03Serverless} from './videos/q03/AwsMlQ03Serverless';
import {AwsMlQ04SpotTraining} from './videos/q04/AwsMlQ04SpotTraining';
import {AwsMlQ05ModelMonitor} from './videos/q05/AwsMlQ05ModelMonitor';
import {AwsMlQ06MultiModelEndpoint} from './videos/q06/AwsMlQ06MultiModelEndpoint';
import {AwsMlQ07BatchTransform} from './videos/q07/AwsMlQ07BatchTransform';
import {AwsMlQ08Clarify} from './videos/q08/AwsMlQ08Clarify';

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
      <Composition
        id="Q02-Recall"
        component={AwsMlQ02Recall}
        durationInFrames={1625}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Q03-Serverless"
        component={AwsMlQ03Serverless}
        durationInFrames={1924}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Q04-SpotTraining"
        component={AwsMlQ04SpotTraining}
        durationInFrames={1835}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Q05-ModelMonitor"
        component={AwsMlQ05ModelMonitor}
        durationInFrames={1988}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Q06-MultiModelEndpoint"
        component={AwsMlQ06MultiModelEndpoint}
        durationInFrames={1898}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Q07-BatchTransform"
        component={AwsMlQ07BatchTransform}
        durationInFrames={1856}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Q08-Clarify"
        component={AwsMlQ08Clarify}
        durationInFrames={1939}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
