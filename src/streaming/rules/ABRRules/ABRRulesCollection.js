/**
 * The copyright in this software is being made available under the BSD License,
 * included below. This software may be subject to other third party and contributor
 * rights, including patent rights, and no such rights are granted under this license.
 *
 * Copyright (c) 2013, Dash Industry Forum.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *  * Redistributions of source code must retain the above copyright notice, this
 *  list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above copyright notice,
 *  this list of conditions and the following disclaimer in the documentation and/or
 *  other materials provided with the distribution.
 *  * Neither the name of Dash Industry Forum nor the names of its
 *  contributors may be used to endorse or promote products derived from this software
 *  without specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS AS IS AND ANY
 *  EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 *  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 *  IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 *  INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 *  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 *  PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 *  WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 *  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 *  POSSIBILITY OF SUCH DAMAGE.
 */
import ThroughputRule from './ThroughputRule.js';
import BufferOccupancyRule from './BufferOccupancyRule.js';
import InsufficientBufferRule from './InsufficientBufferRule.js';
import AbandonRequestsRule from './AbandonRequestsRule.js';
import MetricsModel from '../../models/MetricsModel.js';
import DashMetricsExtensions from '../../../dash/extensions/DashMetricsExtensions.js';
import FactoryMaker from '../../../core/FactoryMaker.js';

const QUALITY_SWITCH_RULES = 'qualitySwitchRules';
const ABANDON_FRAGMENT_RULES = 'abandonFragmentRules';

function ABRRulesCollection() {

    let context = this.context;

    let instance,
        qualitySwitchRules,
        abandonFragmentRules;

    function initialize() {
        qualitySwitchRules = [];
        abandonFragmentRules = [];

        let metricsModel = MetricsModel(context).getInstance();

        qualitySwitchRules.push(ThroughputRule(context).create({
                metricsModel: metricsModel,
                metricsExt: DashMetricsExtensions(context).getInstance()
            })
        );
        qualitySwitchRules.push(BufferOccupancyRule(context).create({metricsModel: metricsModel}));
        qualitySwitchRules.push(InsufficientBufferRule(context).create({metricsModel: metricsModel}));
        abandonFragmentRules.push(AbandonRequestsRule(context).create());
    }

    function getRules (type) {
        switch (type) {
            case QUALITY_SWITCH_RULES:
                return qualitySwitchRules;
            case ABANDON_FRAGMENT_RULES:
                return abandonFragmentRules;
            default:
                return null;
        }
    }

    instance = {
        initialize: initialize,
        getRules: getRules
    };

    return instance;
}

let factory =  FactoryMaker.getSingletonFactory(ABRRulesCollection);

factory.QUALITY_SWITCH_RULES = QUALITY_SWITCH_RULES;
factory.ABANDON_FRAGMENT_RULES = ABANDON_FRAGMENT_RULES;

export default factory;