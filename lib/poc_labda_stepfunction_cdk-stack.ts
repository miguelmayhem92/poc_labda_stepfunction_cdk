import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';

export class PocLabdaStepfunctionCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps){
    super(scope, id, props)

    const orchestrator_lambda = new lambda.Function(this, 'orchestrator', {
      runtime: lambda.Runtime.PYTHON_3_11,
      handler: 'main.handler',
      code: lambda.Code.fromAsset("./modules/orchestrator"),
    });

    // const myStateMachine = new sfn.StateMachine(this, 'my_workflow_poc', {
    //   definition: new tasks.LambdaInvoke(this, "launch_orchestrator", {
    //     lambdaFunction: orchestrator_lambda
    //   }).next(new sfn.Succeed(this, "GreetedWorld"))
    // });

  }
}