import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Action } from 'aws-cdk-lib/aws-codepipeline';

export class PocLabdaStepfunctionCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps){
    super(scope, id, props)

    const orchestrator_lambda = new lambda.Function(this, 'orchestrator', {
      runtime: lambda.Runtime.PYTHON_3_11,
      handler: 'main.handler',
      code: lambda.Code.fromAsset("./modules/orchestrator"),
      functionName: 'orchestrator_function_name'
    });

    const worker_1_lambda = new lambda.Function(this, 'worker_1', {
      runtime: lambda.Runtime.PYTHON_3_11,
      handler: 'main_lambda1.handler',
      code: lambda.Code.fromAsset("./modules/lambda1"),
      functionName: 'worker_1'
    });

    const worker_2_lambda = new lambda.Function(this, 'worker_2', {
      runtime: lambda.Runtime.PYTHON_3_11,
      handler: 'main_lambda2.handler',
      code: lambda.Code.fromAsset("./modules/lambda2"),
      functionName: 'worker_2'
    });

    const worker_consolidator = new lambda.Function(this, 'consolidator', {
      runtime: lambda.Runtime.PYTHON_3_11,
      handler: 'main.handler',
      code: lambda.Code.fromAsset("./modules/consolidator"),
      functionName: 'consolidator'
    });

     const iam_role = new iam.Role(this, 'poc_lambda_state_gato', {
      assumedBy: new iam.ServicePrincipal('states.amazonaws.com'),
      roleName:'poc_lambda_statemachine_role'
    });
    iam_role.addToPolicy( new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ["*"],
      actions: ['lambda:InvokeFunction']
    }))
    // iam_role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"))
    // iam_role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambda_FullAccess"))


    const myStateMachine = new sfn.StateMachine(this, 'my_workflow_poc', {
      definitionBody: sfn.DefinitionBody.fromFile("./modules/stepfunction/workflow.json"),
      stateMachineName: "my_workflow_poc_name",
      role: iam_role
    });
  }
}