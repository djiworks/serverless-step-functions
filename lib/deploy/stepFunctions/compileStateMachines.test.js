'use strict';

const expect = require('chai').expect;
const Serverless = require('serverless/lib/Serverless');
const AwsProvider = require('serverless/lib/plugins/aws/provider/awsProvider');
const ServerlessStepFunctions = require('./../../index');

describe('#compileStateMachines', () => {
  let serverless;
  let serverlessStepFunctions;

  beforeEach(() => {
    serverless = new Serverless();
    serverless.cli = {
      consoleLog: () => {},
    };
    serverless.servicePath = true;
    serverless.service.service = 'step-functions';
    serverless.service.provider.compiledCloudFormationTemplate = {
      Resources: {},
      Outputs: {},
    };
    serverless.setProvider('aws', new AwsProvider(serverless));
    serverlessStepFunctions = new ServerlessStepFunctions(serverless);
  });

  it('should create corresponding resources when definition and name property is given', () => {
    serverless.service.stepFunctions = {
      stateMachines: {
        myStateMachine1: {
          name: 'stateMachineBeta1',
          definition: 'definition1',
        },
        myStateMachine2: {
          name: 'stateMachineBeta2',
          definition: 'definition2',
        },
      },
    };

    serverlessStepFunctions.compileStateMachines();

    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta1.Type).to.equal('AWS::StepFunctions::StateMachine');
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta2.Type).to.equal('AWS::StepFunctions::StateMachine');
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta1.Properties.DefinitionString).to.equal('"definition1"');
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta2.Properties.DefinitionString).to.equal('"definition2"');
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta1.Properties.RoleArn['Fn::GetAtt'][0]).to.equal('IamRoleStateMachineExecution');
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta2.Properties.RoleArn['Fn::GetAtt'][0]).to.equal('IamRoleStateMachineExecution');
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta1.DependsOn).to.deep.eq(['IamRoleStateMachineExecution']);
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta2.DependsOn).to.deep.eq(['IamRoleStateMachineExecution']);
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Outputs
      .StateMachineBeta1Arn.Value.Ref).to.equal('StateMachineBeta1');
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Outputs
      .StateMachineBeta2Arn.Value.Ref).to.equal('StateMachineBeta2');
  });

  it('should create corresponding resources when definition property is given and no name', () => {
    serverless.service.stepFunctions = {
      stateMachines: {
        myStateMachine1: {
          definition: 'definition1',
        },
        myStateMachine2: {
          definition: 'definition2',
        },
      },
    };

    serverlessStepFunctions.compileStateMachines();
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .MyStateMachine1StepFunctionsStateMachine.Type).to.equal('AWS::StepFunctions::StateMachine');
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .MyStateMachine2StepFunctionsStateMachine.Type).to.equal('AWS::StepFunctions::StateMachine');
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .MyStateMachine1StepFunctionsStateMachine.Properties.DefinitionString).to.equal('"definition1"');
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .MyStateMachine2StepFunctionsStateMachine.Properties.DefinitionString).to.equal('"definition2"');
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .MyStateMachine1StepFunctionsStateMachine.Properties.RoleArn['Fn::GetAtt'][0]).to.equal('IamRoleStateMachineExecution');
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .MyStateMachine2StepFunctionsStateMachine.Properties.RoleArn['Fn::GetAtt'][0]).to.equal('IamRoleStateMachineExecution');
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .MyStateMachine1StepFunctionsStateMachine.DependsOn).to.deep.eq(['IamRoleStateMachineExecution']);
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .MyStateMachine2StepFunctionsStateMachine.DependsOn).to.deep.eq(['IamRoleStateMachineExecution']);
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Outputs
      .MyStateMachine1StepFunctionsStateMachineArn.Value.Ref).to.equal('MyStateMachine1StepFunctionsStateMachine');
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Outputs
      .MyStateMachine2StepFunctionsStateMachineArn.Value.Ref).to.equal('MyStateMachine2StepFunctionsStateMachine');
  });

  it('should create named resources when Name is provided', () => {
    serverless.service.stepFunctions = {
      stateMachines: {
        myStateMachine1: {
          definition: 'definition1',
          name: 'stateMachineBeta1',
        },
        myStateMachine2: {
          definition: 'definition2',
          name: 'stateMachineBeta2',
        },
      },
    };

    serverlessStepFunctions.compileStateMachines();
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta1.Type).to.equal('AWS::StepFunctions::StateMachine');
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta2.Type).to.equal('AWS::StepFunctions::StateMachine');
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta1.Properties.DefinitionString).to.equal('"definition1"');
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta2.Properties.DefinitionString).to.equal('"definition2"');
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta1.Properties.RoleArn['Fn::GetAtt'][0]).to.equal('IamRoleStateMachineExecution');
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta2.Properties.RoleArn['Fn::GetAtt'][0]).to.equal('IamRoleStateMachineExecution');
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta1.DependsOn).to.deep.eq(['IamRoleStateMachineExecution']);
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta2.DependsOn).to.deep.eq(['IamRoleStateMachineExecution']);
  });

  it('should create corresponding resources when definition and role property are given', () => {
    serverless.service.stepFunctions = {
      stateMachines: {
        myStateMachine1: {
          name: 'stateMachineBeta1',
          definition: 'definition1',
          role: 'arn:aws:role1',
        },
        myStateMachine2: {
          name: 'stateMachineBeta2',
          definition: 'definition2',
          role: 'arn:aws:role2',
        },
      },
    };

    serverlessStepFunctions.compileStateMachines();
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta1.Type).to.equal('AWS::StepFunctions::StateMachine');
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta2.Type).to.equal('AWS::StepFunctions::StateMachine');
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta1.Properties.DefinitionString).to.equal('"definition1"');
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta2.Properties.DefinitionString).to.equal('"definition2"');
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta1.Properties.RoleArn).to.equal('arn:aws:role1');
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta2.Properties.RoleArn).to.equal('arn:aws:role2');
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Outputs
      .StateMachineBeta1Arn.Value.Ref).to.equal('StateMachineBeta1');
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Outputs
      .StateMachineBeta2Arn.Value.Ref).to.equal('StateMachineBeta2');
  });

  it('should respect CloudFormation intrinsic functions for role property', () => {
    serverless.service.stepFunctions = {
      stateMachines: {
        myStateMachine1: {
          name: 'stateMachineWithIntrinsicRole1',
          definition: 'definition1\n',
          role: { 'Fn::GetAtt': ['RoleID', 'Arn'] },
        },
        myStateMachine2: {
          name: 'stateMachineWithIntrinsicRole2',
          definition: 'definition1\n',
          role: { Ref: 'CloudformationId' },
        },
      },
    };
    serverlessStepFunctions.compileStateMachines();
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineWithIntrinsicRole1.Properties.RoleArn).to.deep.equal({ 'Fn::GetAtt': ['RoleID', 'Arn'] });
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineWithIntrinsicRole2.Properties.RoleArn).to.deep.equal({ Ref: 'CloudformationId' });
  });

  it('should throw error if role property is neither string nor intrinsic functions', () => {
    serverless.service.stepFunctions = {
      stateMachines: {
        myStateMachine1: {
          name: 'stateMachineWithIntrinsicRole',
          definition: 'definition1\n',
          role: { XXX: ['RoleID', 'Arn'] },
        },
      },
    };
    expect(() => serverlessStepFunctions.compileStateMachines()).to.throw(Error);
  });

  it('should throw error when definition property is not given', () => {
    serverless.service.stepFunctions = {
      stateMachines: {
        myStateMachine1: {
        },
      },
    };
    expect(() => serverlessStepFunctions.compileStateMachines()).to.throw(Error);
  });

  it('should respect variables if multi-line variables is given', () => {
    serverless.service.stepFunctions = {
      stateMachines: {
        myStateMachine1: {
          name: 'stateMachineBeta1',
          definition: 'definition1\n',
        },
        myStateMachine2: {
          name: 'stateMachineBeta2',
          definition: 'definition2\n',
        },
      },
    };

    serverlessStepFunctions.compileStateMachines();
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta1.Type).to.equal('AWS::StepFunctions::StateMachine');
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta2.Type).to.equal('AWS::StepFunctions::StateMachine');
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta1.Properties.DefinitionString).to.equal('"definition1"');
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta2.Properties.DefinitionString).to.equal('"definition2"');
  });

  it('should throw error when role property is not given as ARN format', () => {
    serverless.service.stepFunctions = {
      stateMachines: {
        myStateMachine1: {
          definition: 'definition1',
          role: 'srn:aws:role1',
          name: 'stateMachineBeta1',
        },
      },
    };
    expect(() => serverlessStepFunctions.compileStateMachines()).to.throw(Error);
  });

  it('should throw error when role property is not given as string', () => {
    serverless.service.stepFunctions = {
      stateMachines: {
        myStateMachine1: {
          name: 'stateMachineBeta1',
          definition: 'definition1',
          role: { 'arn:aws:role1': 'ss' },
        },
      },
    };
    expect(() => serverlessStepFunctions.compileStateMachines()).to.throw(Error);

    serverless.service.stepFunctions = {
      stateMachines: {
        myStateMachine1: {
          name: 'stateMachineBeta2',
          definition: 'definition1',
          role: ['arn:aws:role1'],
        },
      },
    };
    expect(() => serverlessStepFunctions.compileStateMachines()).to.throw(Error);
  });

  it('should not create corresponding resources when stepfunctions are not given', () => {
    serverlessStepFunctions.compileStateMachines();

    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources).to.deep.equal({});
  });

  it('should not create corresponding resources when stateMachines are not given', () => {
    serverless.service.stepFunctions = {};
    serverlessStepFunctions.compileStateMachines();

    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources).to.deep.equal({});
  });

  it('should print pretty JSON for the state machine definition', () => {
    const definition = {
      Comment: 'Hello World',
      StartAt: 'HelloWorld',
      States: {
        HelloWorld: {
          Type: 'Task',
          Resource: 'arn:aws:lambda:#{AWS::Region}:#{AWS::AccountId}:function:hello',
          End: true,
        },
      },
    };

    serverless.service.stepFunctions = {
      stateMachines: {
        myStateMachine1: {
          name: 'stateMachineBeta1',
          definition,
        },
      },
    };

    serverlessStepFunctions.compileStateMachines();
    const actual = serverlessStepFunctions
      .serverless
      .service
      .provider
      .compiledCloudFormationTemplate
      .Resources
      .StateMachineBeta1
      .Properties
      .DefinitionString;

    expect(actual).to.equal(JSON.stringify(definition, undefined, 2));
  });

  it('should add dependsOn resources', () => {
    serverless.service.stepFunctions = {
      stateMachines: {
        myStateMachine1: {
          definition: 'definition1',
          name: 'stateMachineBeta1',
          dependsOn: 'DynamoDBTable',
        },
        myStateMachine2: {
          definition: 'definition2',
          name: 'stateMachineBeta2',
          dependsOn: [
            'DynamoDBTable',
            'KinesisStream',
          ],
        },
      },
    };

    serverlessStepFunctions.compileStateMachines();
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta1.Type).to.equal('AWS::StepFunctions::StateMachine');
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta2.Type).to.equal('AWS::StepFunctions::StateMachine');
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta1.Properties.DefinitionString).to.equal('"definition1"');
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta2.Properties.DefinitionString).to.equal('"definition2"');
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta1.Properties.RoleArn['Fn::GetAtt'][0]).to.equal('IamRoleStateMachineExecution');
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta2.Properties.RoleArn['Fn::GetAtt'][0]).to.equal('IamRoleStateMachineExecution');
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta1.DependsOn).to.deep.eq(['IamRoleStateMachineExecution', 'DynamoDBTable']);
    expect(serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta2.DependsOn).to.deep.eq(['IamRoleStateMachineExecution', 'DynamoDBTable', 'KinesisStream']);
  });

  it('should throw error when dependsOn property is neither string nor [string]', () => {
    serverless.service.stepFunctions = {
      stateMachines: {
        myStateMachine1: {
          definition: 'definition1',
          name: 'stateMachineBeta1',
          dependsOn: { Ref: 'ss' },
        },
      },
    };
    expect(() => serverlessStepFunctions.compileStateMachines()).to.throw(Error);

    serverless.service.stepFunctions = {
      stateMachines: {
        myStateMachine1: {
          definition: 'definition1',
          name: 'stateMachineBeta1',
          dependsOn: [{ Ref: 'ss' }],
        },
      },
    };
    expect(() => serverlessStepFunctions.compileStateMachines()).to.throw(Error);
  });

  it('should add tags', () => {
    serverless.service.stepFunctions = {
      stateMachines: {
        myStateMachine1: {
          definition: 'definition1',
          name: 'stateMachineBeta1',
          tags: {
            team: 'core',
            score: 42,
          },
        },
        myStateMachine2: {
          definition: 'definition2',
          name: 'stateMachineBeta2',
          tags: {
            team: 'core',
            score: 42,
          },
        },
      },
    };

    serverlessStepFunctions.compileStateMachines();
    const stateMachineBeta1 = serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta1;
    const stateMachineBeta2 = serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta2;
    expect(stateMachineBeta1.Properties.Tags).to.have.lengthOf(2);
    expect(stateMachineBeta2.Properties.Tags).to.have.lengthOf(2);
    expect(stateMachineBeta1.Properties.Tags)
      .to.deep.eq([{ Key: 'team', Value: 'core' }, { Key: 'score', Value: '42' }]);
    expect(stateMachineBeta2.Properties.Tags)
      .to.deep.eq([{ Key: 'team', Value: 'core' }, { Key: 'score', Value: '42' }]);
  });

  it('should add global tags', () => {
    serverless.service.provider.tags = {
      team: 'core',
      score: 42,
    };

    serverless.service.stepFunctions = {
      stateMachines: {
        myStateMachine1: {
          definition: 'definition1',
          name: 'stateMachineBeta1',
        },
        myStateMachine2: {
          definition: 'definition2',
          name: 'stateMachineBeta2',
        },
      },
    };

    serverlessStepFunctions.compileStateMachines();
    const stateMachineBeta1 = serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta1;
    const stateMachineBeta2 = serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta2;
    expect(stateMachineBeta1.Properties.Tags).to.have.lengthOf(2);
    expect(stateMachineBeta2.Properties.Tags).to.have.lengthOf(2);
    expect(stateMachineBeta1.Properties.Tags)
      .to.deep.eq([{ Key: 'team', Value: 'core' }, { Key: 'score', Value: '42' }]);
    expect(stateMachineBeta2.Properties.Tags)
      .to.deep.eq([{ Key: 'team', Value: 'core' }, { Key: 'score', Value: '42' }]);
  });

  it('should merge global and state machine tags', () => {
    serverless.service.provider.tags = {
      team: 'core',
    };

    serverless.service.stepFunctions = {
      stateMachines: {
        myStateMachine1: {
          definition: 'definition1',
          name: 'stateMachineBeta1',
          tags: {
            score: 42,
          },
        },
        myStateMachine2: {
          definition: 'definition2',
          name: 'stateMachineBeta2',
          tags: {
            score: 42,
          },
        },
      },
    };

    serverlessStepFunctions.compileStateMachines();
    const stateMachineBeta1 = serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta1;
    const stateMachineBeta2 = serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachineBeta2;
    expect(stateMachineBeta1.Properties.Tags).to.have.lengthOf(2);
    expect(stateMachineBeta2.Properties.Tags).to.have.lengthOf(2);
    expect(stateMachineBeta1.Properties.Tags)
      .to.deep.eq([{ Key: 'team', Value: 'core' }, { Key: 'score', Value: '42' }]);
    expect(stateMachineBeta2.Properties.Tags)
      .to.deep.eq([{ Key: 'team', Value: 'core' }, { Key: 'score', Value: '42' }]);
  });

  it('should throw error when tags property contains malformed tags', () => {
    serverless.service.stepFunctions = {
      stateMachines: {
        myStateMachine1: {
          definition: 'definition1',
          name: 'stateMachineBeta1',
          tags: ['team:core'],
        },
      },
    };

    expect(() => serverlessStepFunctions.compileStateMachines()).to.throw(Error);
  });

  it('should respect CloudFormation intrinsic functions', () => {
    serverless.service.stepFunctions = {
      stateMachines: {
        myStateMachine: {
          name: 'stateMachine',
          definition: {
            StartAt: 'Lambda',
            States: {
              Lambda: {
                Type: 'Task',
                Resource: {
                  Ref: 'MyFunction',
                },
                Next: 'Sns',
              },
              Sns: {
                Type: 'Task',
                Resource: 'arn:aws:states:::sns:publish',
                Parameters: {
                  Message: {
                    'Fn::GetAtt': ['MyTopic', 'TopicName'],
                  },
                  TopicArn: {
                    Ref: 'MyTopic',
                  },
                },
                Next: 'Sqs',
              },
              Sqs: {
                Type: 'Task',
                Resource: 'arn:aws:states:::sqs:sendMessage',
                Parameters: {
                  QueueUrl: {
                    Ref: 'MyQueue',
                  },
                  MessageBody: 'This is a static message',
                },
                Next: 'Parallel',
              },
              Parallel: {
                Type: 'Parallel',
                End: true,
                Branches: [
                  {
                    StartAt: 'Lambda2',
                    States: {
                      Lambda2: {
                        Type: 'Task',
                        Resource: {
                          Ref: 'MyFunction2',
                        },
                        End: true,
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
    };

    serverlessStepFunctions.compileStateMachines();
    const stateMachine = serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .StateMachine;

    expect(stateMachine.Properties.DefinitionString).to.haveOwnProperty('Fn::Sub');
    expect(stateMachine.Properties.DefinitionString['Fn::Sub']).to.have.lengthOf(2);

    const [json, params] = stateMachine.Properties.DefinitionString['Fn::Sub'];
    const modifiedDefinition = JSON.parse(json);

    const lambda = modifiedDefinition.States.Lambda;
    expect(lambda.Resource.startsWith('${')).to.eq(true);
    const functionParam = lambda.Resource.replace(/[${}]/g, '');
    expect(params).to.haveOwnProperty(functionParam);
    expect(params[functionParam]).to.eql({ Ref: 'MyFunction' });

    const sns = modifiedDefinition.States.Sns;
    expect(sns.Parameters.Message.startsWith('${')).to.eq(true);
    const topicNameParam = sns.Parameters.Message.replace(/[${}]/g, '');
    expect(params).to.haveOwnProperty(topicNameParam);
    expect(params[topicNameParam]).to.eql({ 'Fn::GetAtt': ['MyTopic', 'TopicName'] });
    expect(sns.Parameters.TopicArn.startsWith('${')).to.eq(true);
    const topicArnParam = sns.Parameters.TopicArn.replace(/[${}]/g, '');
    expect(params).to.haveOwnProperty(topicArnParam);
    expect(params[topicArnParam]).to.eql({ Ref: 'MyTopic' });

    const sqs = modifiedDefinition.States.Sqs;
    expect(sqs.Parameters.QueueUrl.startsWith('${')).to.eq(true);
    const queueUrlParam = sqs.Parameters.QueueUrl.replace(/[${}]/g, '');
    expect(params[queueUrlParam]).to.eql({ Ref: 'MyQueue' });

    const parallel = modifiedDefinition.States.Parallel;
    expect(parallel.Branches).to.have.lengthOf(1);
    const lambda2 = parallel.Branches[0].States.Lambda2;
    expect(lambda2.Resource.startsWith('${')).to.eq(true);
    const functionParam2 = lambda2.Resource.replace(/[${}]/g, '');
    expect(params).to.haveOwnProperty(functionParam2);
    expect(params[functionParam2]).to.eql({ Ref: 'MyFunction2' });
  });

  it('should allow null values #193', () => {
    serverless.service.stepFunctions = {
      stateMachines: {
        myStateMachine1: {
          id: 'Test',
          name: 'test',
          definition: {
            StartAt: 'AnyStep',
            States: {
              AnyStep: {
                Type: 'Pass',
                ResultPath: null,
                Next: 'Finish',
              },
              Finish: {
                Type: 'Succeed',
              },
            },
          },
        },
      },
    };

    serverlessStepFunctions.compileStateMachines();
    const stateMachine = serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .Test;

    expect(stateMachine.Properties.DefinitionString).to.not.equal(null);
  });

  it('should not interpret states starting with "Ref" as intrinsic functions #203', () => {
    serverless.service.stepFunctions = {
      stateMachines: {
        myStateMachine1: {
          id: 'Test',
          name: 'test',
          definition: {
            StartAt: 'One',
            States: {
              One: {
                Type: 'Wait',
                Seconds: 10,
                Next: 'RefreshLead',
              },
              RefreshLead: {
                Type: 'Task',
                Resource: 'arn:aws:lambda:us-east-1:12345:function:test-dev-lambda',
                TimeoutSeconds: 60,
                Next: 'EndState',
              },
              EndState: {
                Type: 'Succeed',
              },
            },
          },
        },
      },
    };

    serverlessStepFunctions.compileStateMachines();
    const stateMachine = serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .Test;

    expect(stateMachine.Properties.DefinitionString).to.not.haveOwnProperty('Fn::Sub');
    const stateMachineObj = JSON.parse(stateMachine.Properties.DefinitionString);
    expect(stateMachineObj.States).to.haveOwnProperty('One');
    expect(stateMachineObj.States).to.haveOwnProperty('RefreshLead');
    expect(stateMachineObj.States).to.haveOwnProperty('EndState');
  });

  it('should support local function names', () => {
    serverless.service.functions = {
      'hello-world': {
        handler: 'hello-world.handler',
      },
    };
    serverless.service.stepFunctions = {
      stateMachines: {
        myStateMachine1: {
          id: 'Test',
          definition: {
            StartAt: 'Lambda',
            States: {
              Lambda: {
                Type: 'Task',
                Resource: {
                  'Fn::GetAtt': ['hello-world', 'Arn'],
                },
                End: true,
              },
            },
          },
        },
      },
    };

    serverlessStepFunctions.compileStateMachines();
    const stateMachine = serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .Test;

    expect(stateMachine.Properties.DefinitionString).to.haveOwnProperty('Fn::Sub');
    expect(stateMachine.Properties.DefinitionString['Fn::Sub']).to.have.lengthOf(2);

    const [json, params] = stateMachine.Properties.DefinitionString['Fn::Sub'];
    const modifiedDefinition = JSON.parse(json);

    const lambda = modifiedDefinition.States.Lambda;
    expect(lambda.Resource.startsWith('${')).to.eq(true);
    const functionParam = lambda.Resource.replace(/[${}]/g, '');
    expect(params).to.haveOwnProperty(functionParam);

    const refParam = params[functionParam];
    expect(refParam).to.eql({ 'Fn::GetAtt': ['HelloDashworldLambdaFunction', 'Arn'] });
  });

  it('should support local function names for lambda::invoke resource type', () => {
    serverless.service.functions = {
      'hello-world': {
        handler: 'hello-world.handler',
      },
    };
    serverless.service.stepFunctions = {
      stateMachines: {
        myStateMachine1: {
          id: 'Test',
          definition: {
            StartAt: 'Lambda1',
            States: {
              Lambda1: {
                Type: 'Task',
                Resource: 'arn:aws:states:::lambda:invoke',
                Parameters: {
                  FunctionName: {
                    Ref: 'hello-world',
                  },
                  Payload: {
                    'ExecutionName.$': '$$.Execution.Name',
                  },
                },
                Next: 'Lambda2',
              },
              Lambda2: {
                Type: 'Task',
                Resource: 'arn:aws:states:::lambda:invoke',
                Parameters: {
                  FunctionName: {
                    'Fn::GetAtt': ['hello-world', 'Arn'],
                  },
                  Payload: {
                    'ExecutionName.$': '$$.Execution.Name',
                  },
                },
                End: true,
              },
            },
          },
        },
      },
    };

    serverlessStepFunctions.compileStateMachines();
    const stateMachine = serverlessStepFunctions.serverless.service
      .provider.compiledCloudFormationTemplate.Resources
      .Test;

    expect(stateMachine.Properties.DefinitionString).to.haveOwnProperty('Fn::Sub');
    expect(stateMachine.Properties.DefinitionString['Fn::Sub']).to.have.lengthOf(2);

    const [json, params] = stateMachine.Properties.DefinitionString['Fn::Sub'];
    const modifiedDefinition = JSON.parse(json);

    const lambda1 = modifiedDefinition.States.Lambda1;
    expect(lambda1.Parameters.FunctionName.startsWith('${')).to.eq(true);
    const lambda1ParamName = lambda1.Parameters.FunctionName.replace(/[${}]/g, '');
    expect(params).to.haveOwnProperty(lambda1ParamName);
    const lambda1Param = params[lambda1ParamName];
    expect(lambda1Param).to.eql({ Ref: 'HelloDashworldLambdaFunction' });

    const lambda2 = modifiedDefinition.States.Lambda2;
    expect(lambda2.Parameters.FunctionName.startsWith('${')).to.eq(true);
    const lambda2ParamName = lambda2.Parameters.FunctionName.replace(/[${}]/g, '');
    expect(params).to.haveOwnProperty(lambda2ParamName);
    const lambda2Param = params[lambda2ParamName];
    expect(lambda2Param).to.eql({ 'Fn::GetAtt': ['HelloDashworldLambdaFunction', 'Arn'] });
  });

  describe('#useExactVersions', () => {
    beforeEach(() => {
      serverless.service.stepFunctions = {
        stateMachines: {
          myStateMachine1: {
            id: 'Test',
            useExactVersion: true,
            definition: {
              StartAt: 'Lambda1',
              States: {
                Lambda1: {
                  Type: 'Task',
                  Resource: 'arn:aws:states:::lambda:invoke',
                  Parameters: {
                    FunctionName: {
                      Ref: 'HelloLambdaFunction',
                    },
                    Payload: {
                      'ExecutionName.$': '$$.Execution.Name',
                    },
                  },
                  Next: 'Lambda2',
                },
                Lambda2: {
                  Type: 'Task',
                  Resource: {
                    'Fn::GetAtt': ['WorldLambdaFunction', 'Arn'],
                  },
                  End: true,
                },
              },
            },
          },
        },
      };

      serverlessStepFunctions.serverless.service
        .provider.compiledCloudFormationTemplate.Resources
        .HelloLambdaFunction = {
          Type: 'AWS::Lambda::Function',
        };

      serverlessStepFunctions.serverless.service
        .provider.compiledCloudFormationTemplate.Resources
        .WorldLambdaFunction = {
          Type: 'AWS::Lambda::Function',
        };
    });

    const compileStateMachines = () => {
      serverlessStepFunctions.compileStateMachines();
      const stateMachine = serverlessStepFunctions.serverless.service
        .provider.compiledCloudFormationTemplate.Resources
        .Test;

      expect(stateMachine.Properties.DefinitionString).to.haveOwnProperty('Fn::Sub');
      expect(stateMachine.Properties.DefinitionString['Fn::Sub']).to.have.lengthOf(2);

      const [json, params] = stateMachine.Properties.DefinitionString['Fn::Sub'];
      const modifiedDefinition = JSON.parse(json);

      const lambda1 = modifiedDefinition.States.Lambda1;
      expect(lambda1.Parameters.FunctionName.startsWith('${')).to.eq(true);
      const lambda1ParamName = lambda1.Parameters.FunctionName.replace(/[${}]/g, '');
      expect(params).to.haveOwnProperty(lambda1ParamName);
      const lambda1Param = params[lambda1ParamName];

      const lambda2 = modifiedDefinition.States.Lambda2;
      expect(lambda2.Resource.startsWith('${')).to.eq(true);
      const lambda2ParamName = lambda2.Resource.replace(/[${}]/g, '');
      expect(params).to.haveOwnProperty(lambda2ParamName);
      const lambda2Param = params[lambda2ParamName];

      return { lambda1Param, lambda2Param };
    };

    it('should change refs to lambda version when useExactVersion is true', () => {
      serverlessStepFunctions.serverless.service
        .provider.compiledCloudFormationTemplate.Resources
        .Lambda1Version13579 = {
          Type: 'AWS::Lambda::Version',
          Properties: {
            FunctionName: {
              Ref: 'HelloLambdaFunction',
            },
          },
        };

      serverlessStepFunctions.serverless.service
        .provider.compiledCloudFormationTemplate.Resources
        .Lambda2Version24680 = {
          Type: 'AWS::Lambda::Version',
          Properties: {
            FunctionName: {
              Ref: 'WorldLambdaFunction',
            },
          },
        };

      const { lambda1Param, lambda2Param } = compileStateMachines();
      expect(lambda1Param).to.eql({ Ref: 'Lambda1Version13579' });
      expect(lambda2Param).to.eql({ Ref: 'Lambda2Version24680' });
    });

    it('should not change refs to lambda version if version is not found, even if useExactVersion is true', () => {
      const { lambda1Param, lambda2Param } = compileStateMachines();
      expect(lambda1Param).to.eql({ Ref: 'HelloLambdaFunction' });
      expect(lambda2Param).to.eql({ 'Fn::GetAtt': ['WorldLambdaFunction', 'Arn'] });
    });

    it('should not change refs to lambda version if not using intrinsic functions, even if useExactVersion is true', () => {
      const states = serverless.service.stepFunctions
        .stateMachines.myStateMachine1.definition.States;
      states.Lambda1.Parameters.FunctionName = 'hello';
      states.Lambda2.Resource = 'arn:aws:lambda:us-east-1:1234567890:function:world';

      serverlessStepFunctions.compileStateMachines();
      const stateMachine = serverlessStepFunctions.serverless.service
        .provider.compiledCloudFormationTemplate.Resources
        .Test;

      const definition = JSON.parse(stateMachine.Properties.DefinitionString);
      expect(definition.States.Lambda1.Parameters.FunctionName).to.equal('hello');
      expect(definition.States.Lambda2.Resource)
        .to.equal('arn:aws:lambda:us-east-1:1234567890:function:world');
    });

    it('should do nothing if there are no ref to lambda functions, even if useExactVersion is true', () => {
      serverless.service.stepFunctions = {
        stateMachines: {
          myStateMachine1: {
            id: 'Test',
            useExactVersion: true,
            definition: {
              StartAt: 'Sns',
              States: {
                Sns: {
                  Type: 'Task',
                  Resource: 'arn:aws:states:::sns:publish',
                  Parameters: {
                    Message: {
                      'Fn::GetAtt': ['MyTopic', 'TopicName'],
                    },
                    TopicArn: {
                      Ref: 'MyTopic',
                    },
                  },
                  End: true,
                },
              },
            },
          },
        },
      };

      serverlessStepFunctions.compileStateMachines();
      const stateMachine = serverlessStepFunctions.serverless.service
        .provider.compiledCloudFormationTemplate.Resources
        .Test;

      expect(stateMachine.Properties.DefinitionString).to.haveOwnProperty('Fn::Sub');
      expect(stateMachine.Properties.DefinitionString['Fn::Sub']).to.have.lengthOf(2);

      const [json, params] = stateMachine.Properties.DefinitionString['Fn::Sub'];
      const modifiedDefinition = JSON.parse(json);

      const sns = modifiedDefinition.States.Sns;
      expect(sns.Parameters.TopicArn.startsWith('${')).to.eq(true);
      const topicArnParam = sns.Parameters.TopicArn.replace(/[${}]/g, '');
      expect(params).to.haveOwnProperty(topicArnParam);
      const topicArn = params[topicArnParam];

      expect(topicArn).to.deep.equal({ Ref: 'MyTopic' });
    });
  });

  it('should not validate definition if not enabled', () => {
    serverless.service.stepFunctions = {
      stateMachines: {
        myStateMachine1: {
          definition: {
            StartAt: 'Start',
            States: {
              Start: {
                Type: 'Inexistant type',
                End: true,
              },
            },
          },
        },
      },
      validate: false,
    };
    // Definition is invalid, but should succeed because validate=false
    serverlessStepFunctions.compileStateMachines();
  });

  it('should validate definition and pass', () => {
    serverless.service.stepFunctions = {
      stateMachines: {
        myStateMachine1: {
          definition: {
            StartAt: 'GetAttResource',
            States: {
              GetAttResource: {
                Type: 'Task',
                Resource: {
                  'Fn::GetAtt': [
                    'lambda-name_GetAtt',
                    'Arn',
                  ],
                },
                Next: 'RefResource',
              },
              RefResource: {
                Type: 'Task',
                Resource: {
                  Ref: 'lambda-name_Ref',
                },
                Next: 'ArnResource',
              },
              ArnResource: {
                Type: 'Task',
                Resource: 'arn:aws:lambda:region-1:1234567890:function:lambda-name_Arn',
                End: true,
              },
            },
          },
        },
      },
      validate: true,
    };
    // Definition is valid, should succeed
    serverlessStepFunctions.compileStateMachines();
  });

  it('should validate definition and fail', () => {
    serverless.service.stepFunctions = {
      stateMachines: {
        myStateMachine1: {
          definition: {
            StartAt: 'Start',
            States: {
              Start: {
                Type: 'Inexistant type',
                End: true,
              },
            },
          },
        },
      },
      validate: true,
    };
    // Definition is invalid and validate=true, should throw
    expect(() => serverlessStepFunctions.compileStateMachines()).to.throw(Error);
  });
});
