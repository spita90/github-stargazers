import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Text } from ".";
import { StarIconSvg } from "../svgs";
import { useTw } from "../theme";
import { GitHubRepo } from "../types";

export interface RepoListItemProps {
  repo: GitHubRepo;
  onPress?: () => void;
}

export function RepoListItem({ repo, onPress }: RepoListItemProps) {
  const [tw] = useTw();

  return (
    <TouchableOpacity
      style={tw`flex flex-row items-center py-sm border-b-[1px] border-grey`}
      onPress={onPress}
    >
      <Text numberOfLines={1}>{repo.name}</Text>
      {repo.stargazers_count > 0 && (
        <View style={tw`flex flex-row items-center`}>
          <Text>{" - "}</Text>
          <StarIconSvg width={15} height={15} color="grey" />
          <Text style={tw`pl-xs`}>{repo.stargazers_count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
