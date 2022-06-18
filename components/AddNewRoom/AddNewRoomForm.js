// author: Abhishek Kumar Singh - https://abheist.com/

import { useForm } from "react-hook-form";
import React from "react";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Flex,
  Textarea,
  RadioGroup,
  HStack,
  Radio,
  Select,
} from "@chakra-ui/react";
import { CREATE_ROOM } from "../../graphql/mutations";
import { useMutation } from "@apollo/client";
import useStore from "../../store";

export default function AddNewRoomForm({ onClose }) {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const user = useStore((state) => state.user);

  const [addRoom, { data }] = useMutation(CREATE_ROOM);
  const onSubmit = async (values) => {
    try {
      const variables = {
        creator_id: user.id,
        ...values,
      };
      console.log(values);
      variables["public"] = "public" === values["public"];
      console.log(variables);
      await addRoom({
        variables,
      });
      onClose();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={errors?.name}>
        <FormLabel htmlFor="name">Name</FormLabel>
        <Input
          id="name"
          placeholder="name of the room"
          {...register("name", {
            required: "This is required",
            minLength: { value: 4, message: "Minimum length should be 4" },
          })}
        />
        <FormErrorMessage>
          {errors?.name && errors?.name.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={errors.description} mt={4}>
        <FormLabel htmlFor="desc">Description</FormLabel>
        <Textarea
          id="desc"
          placeholder="description"
          {...register("desc", {
            required: "This is required",
            minLength: { value: 10, message: "Minimum length should be 10" },
          })}
        />
        <FormErrorMessage>
          {errors.description && errors.description.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl mt={4}>
        <FormLabel htmlFor="icon">Icon</FormLabel>
        <Input id="icon" placeholder="url of icon" {...register("icon")} />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel htmlFor="public">Room Privacy</FormLabel>
        <Select
          defaultValue={"public"}
          {...register("public", { required: "This is required" })}
          id="public"
        >
          <option value={"public"}>Public</option>
          <option value={"private"}>Private</option>
        </Select>
      </FormControl>
      <Flex justify="flex-end" mt={4}>
        <Button colorScheme="blue" mr={3} onClick={onClose} type="button">
          Close
        </Button>
        <Button
          colorScheme="teal"
          isLoading={isSubmitting}
          type="submit"
          colorScheme="teal"
        >
          Submit
        </Button>
      </Flex>
    </form>
  );
}
