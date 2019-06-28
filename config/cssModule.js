/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const loaderUtils = require('loader-utils');

const getLocalIdent = function (
  context,
  localIdentName,
  localName,
  options
) {
  // Create a hash based on a the file location and class name. Will be unique across a project, and close to globally unique.
  const hash = loaderUtils.getHashDigest(
    context.resourcePath + localName,
    'md5',
    'base64',
    5
  );
  if (process.env.NODE_ENV === 'production') {
    return '_' + hash
  }
  // Use loaderUtils to find the file or folder name
  return loaderUtils.interpolateName(
    context,
    localName + '__' + hash,
    options
  );
};

const generateScopedName = (localName, resourcePath) => {
  const hash = loaderUtils.getHashDigest(
    resourcePath + localName,
    'md5',
    'base64',
    5
  );
  if (process.env.NODE_ENV === 'production') {
    return '_' + hash
  }
  return loaderUtils.interpolateName(
    {},
    localName + '__' + hash,
    {},
  );
}
exports.generateScopedName = generateScopedName
exports.getLocalIdent = getLocalIdent
