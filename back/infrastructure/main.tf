terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }
}

locals{
  application_name = "tf-fargate"
  launch_type = "FARGATE"
}

resource "aws_ecs_cluster" "awCluster" {
  name = local.application_name
}

resource "aws_ecs_service" "this" {
  name = "testApp"
  cluster = aws_ecs_cluster.awCluster.arn

  deployment_maximum_percent = 200

  deployment_minimum_healthy_percent = 0

  
  desired_count = 1

  launch_type = local.launch_type

  task_definition = "${aws_ecs_task_definition.task.family}:${aws_ecs_task_definition.task.revision}"

  network_configuration {
    assign_public_ip = true
    security_groups = [aws_security_group.fargate.id]
    subnets = [module.fargate_vpc.public_subnets[0]]
  }
}

resource "aws_iam_role" "fargatson_task_exec_role"{
  name="${local.application_name}-ecsTaskExecutionRole"

  assume_role_policy = jsonencode({
    Version: "2012-10-17",
    Statement:[
      {
        Action: "sts:AssumeRole",
        Principal: {
          Service: "ecs-tasks.amazonaws.com"
        },
        Effect: "Allow",
        Sid: ""
      }]
  })
}

resource "aws_iam_policy_attachment" "ecs-task-ecec-role-att" {
  name       = "ecs-task-prole-att"
  policy_arn = aws_iam_role.fargatson_task_exec_role.arn
}