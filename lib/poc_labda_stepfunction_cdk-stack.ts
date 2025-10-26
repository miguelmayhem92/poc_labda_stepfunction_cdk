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
      definitionBody: sfn.DefinitionBody.fromFile("./modules/stepfunction/test_workflow.json"),
      stateMachineName: "my_workflow_poc_name",
      role: iam_role
    });
  }
}