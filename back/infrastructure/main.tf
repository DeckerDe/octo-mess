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