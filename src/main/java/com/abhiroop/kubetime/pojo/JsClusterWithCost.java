package com.abhiroop.kubetime.pojo;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class JsClusterWithCost implements Serializable{


	/**
	 * 
	 */
	private static final long serialVersionUID = 3749452504996378298L;
	public JsClusterWithCost() {
		super();
	}

	private String name;
	private String endpoint;

	private String status;
	private String token;
	private String environment;
	private double cpucost;
	private double momorycost;
	private double storagecost;
}
